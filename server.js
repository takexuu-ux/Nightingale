import http from 'http';
import tls from 'tls';
import url from 'url';
import zoomProxyHandler from './api/zoom-proxy.js';

const PORT = process.env.PORT || 10000;

const server = http.createServer(async (req, res) => {
  // Pass HTTP requests to our existing zoom-proxy handler
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
    
    upgradeReq.push('', '');
    tlsSocket.write(upgradeReq.join('\r\n'));
    
    if (head && head.length) {
      tlsSocket.write(head);
    }
    
    tlsSocket.pipe(socket);
    socket.pipe(tlsSocket);
  });

  tlsSocket.on('error', (err) => {
    console.error('[WS Proxy] Tunnel error:', err.message);
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.error('[WS Socket] client socket error:', err.message);
    tlsSocket.destroy();
  });
});

server.listen(PORT, () => {
  console.log(`Zoom Proxy server running on port ${PORT}`);
});
