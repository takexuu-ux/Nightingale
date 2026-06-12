import https from 'https';
import { URL } from 'url';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  // 1. Extract path and other query parameters
  const { path, ...queryParams } = req.query;
  
  // 2. Reconstruct target URL, removing any trailing slash from the path to prevent invalid Zoom API routing
  let cleanPath = path || '';
  if (cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  
  const targetUrl = new URL(`https://zoom.us/${cleanPath}`);
  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => targetUrl.searchParams.append(key, v));
    } else {
      targetUrl.searchParams.append(key, value);
    }
  }

  // 3. Prepare headers for the target request
  const headers = { ...req.headers };
  
  // Override headers to simulate requests originating from zoom.us
  headers['host'] = 'zoom.us';
  headers['origin'] = 'https://zoom.us';
  
  if (headers['referer']) {
    try {
      const refUrl = new URL(headers['referer']);
      refUrl.host = 'zoom.us';
      refUrl.protocol = 'https:';
      headers['referer'] = refUrl.toString();
    } catch (e) {
      headers['referer'] = 'https://zoom.us/';
    }
  } else {
    headers['referer'] = 'https://zoom.us/';
  }

  // 4. Perform proxy request
  const proxyReq = https.request(
    targetUrl.toString(),
    {
      method: req.method,
      headers: headers,
    },
    (proxyRes) => {
      // Set the status code
      res.status(proxyRes.statusCode);

      // Copy headers, stripping security/framing restrictions
      const responseHeaders = { ...proxyRes.headers };
      
      // Strip frame-blocking headers
      delete responseHeaders['x-frame-options'];
      delete responseHeaders['content-security-policy'];
      
      // Set CORS headers to allow browser requests
      responseHeaders['access-control-allow-origin'] = '*';
      responseHeaders['access-control-allow-methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
      responseHeaders['access-control-allow-headers'] = '*';

      // Rewrite Location redirect headers to point to our proxy instead of zoom.us
      if (responseHeaders['location']) {
        responseHeaders['location'] = responseHeaders['location'].replace(/^https:\/\/zoom\.us\//i, '/zoom/');
      }

      // Strip domain parameter from Set-Cookie so the browser binds them to our domain
      if (responseHeaders['set-cookie']) {
        if (Array.isArray(responseHeaders['set-cookie'])) {
          responseHeaders['set-cookie'] = responseHeaders['set-cookie'].map((cookie) => {
            return cookie.replace(/domain=\.?zoom\.us;?\s*/gi, '');
          });
        } else if (typeof responseHeaders['set-cookie'] === 'string') {
          responseHeaders['set-cookie'] = responseHeaders['set-cookie'].replace(/domain=\.?zoom\.us;?\s*/gi, '');
        }
      }

      // Apply headers to the response
      for (const [key, value] of Object.entries(responseHeaders)) {
        res.setHeader(key, value);
      }

      // Pipe the response stream back to the client
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Zoom proxy request error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  });

  // Pipe the request body (if any) into the proxy request
  req.pipe(proxyReq);
}
