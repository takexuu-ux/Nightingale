import http from 'http';
import tls from 'tls';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zoomProxyHandler from './api/zoom-proxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 10000;
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function tryServeStatic(req, res, pathname) {
  let cleanPath = pathname;
  if (cleanPath === '/' || cleanPath === '') {
    cleanPath = '/index.html';
  }

  // Look in dist first, then public, then root
  const candidates = [
    path.join(DIST_DIR, cleanPath),
    path.join(PUBLIC_DIR, cleanPath),
    path.join(__dirname, cleanPath)
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return true;
    }
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  req.query = parsedUrl.query || {};
  const pathname = parsedUrl.pathname || '';
  req.path = pathname;

  const isZoom = pathname.startsWith('/zoom') || 
                 pathname.startsWith('/zoom-subdomain') || 
                 pathname.startsWith('/captcha') || 
                 pathname.startsWith('/csrf') ||
                 pathname.startsWith('/api/zoom-proxy');

  if (isZoom) {
    // Pass HTTP requests to our zoom-proxy handler
    try {
      await zoomProxyHandler(req, res);
    } catch (e) {
      console.error('Server error during HTTP proxying:', e);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Server error', message: e.message }));
      }
    }
    return;
  }

  // Serve static assets / HTML
  const served = tryServeStatic(req, res, pathname);
  if (!served) {
    // SPA fallback: if not an asset request, serve index.html
    const hasExt = path.extname(pathname).length > 0;
    if (!hasExt && tryServeStatic(req, res, '/index.html')) {
      return;
    }
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

// Standalone WebSocket upgrade handler (tunnels media/signaling traffic to Zoom)
server.on('upgrade', (req, socket, head) => {
  const parsedUrl = url.parse(req.url || '');
  const pathname = parsedUrl.pathname || '';
  const isZoomWs = pathname.startsWith('/zoom-subdomain/') || pathname.startsWith('/zoom/');
  
  if (!isZoomWs) {
    socket.destroy();
    return;
  }

  let targetHost, targetPath;
  if (pathname.startsWith('/zoom-subdomain/')) {
    const match = pathname.match(/^\/zoom-subdomain\/([a-z0-9\-]+)(.*)/i);
    if (match) {
      targetHost = `${match[1]}.zoom.us`;
      targetPath = match[2] || '/';
    } else {
      targetHost = 'zoom.us';
      targetPath = pathname.slice(16);
    }
  } else {
    targetHost = 'zoom.us';
    targetPath = pathname.slice(5);
  }

  const queryString = parsedUrl.search || '';
  const fullPath = targetPath + queryString;

  console.log(`[WS Proxy] Tunnelling WebSocket to wss://${targetHost}${fullPath}`);

  // Create direct TLS connection to Zoom's secure servers
  const tlsSocket = tls.connect({ host: targetHost, port: 443, servername: targetHost }, () => {
    const upgradeReq = [
      `GET ${fullPath} HTTP/1.1`,
      `Host: ${targetHost}`,
      `Upgrade: websocket`,
      `Connection: Upgrade`,
      `Sec-WebSocket-Version: ${req.headers['sec-websocket-version'] || 13}`,
      `Sec-WebSocket-Key: ${req.headers['sec-websocket-key'] || ''}`,
      `Origin: https://${targetHost}`
    ];
    
    // Pass other headers if present
    if (req.headers['sec-websocket-extensions']) {
      upgradeReq.push(`Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`);
    }
    if (req.headers['sec-websocket-protocol']) {
      upgradeReq.push(`Sec-WebSocket-Protocol: ${req.headers['sec-websocket-protocol']}`);
    }
    if (req.headers['cookie']) {
      upgradeReq.push(`Cookie: ${req.headers['cookie']}`);
    }
    
    upgradeReq.push('', '');
    tlsSocket.write(upgradeReq.join('\r\n'));
    
    if (head && head.length) {
      tlsSocket.write(head);
    }
    
    tlsSocket.pipe(socket);
    socket.pipe(tlsSocket);
  });

  // Ensure clean teardown on socket error or closure
  const cleanup = () => {
    tlsSocket.destroy();
    socket.destroy();
  };

  tlsSocket.on('error', (err) => {
    console.error('[WS Proxy] Tunnel error:', err.message);
    cleanup();
  });

  tlsSocket.on('close', cleanup);
  tlsSocket.on('end', cleanup);

  socket.on('error', (err) => {
    console.error('[WS Socket] Client socket error:', err.message);
    cleanup();
  });

  socket.on('close', cleanup);
  socket.on('end', cleanup);
});

server.listen(PORT, () => {
  console.log(`Nightingale server running on port ${PORT}`);
});
