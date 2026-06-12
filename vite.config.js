import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        allVideos: './all-videos.html'
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://prod-api.nnlone.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            const auth = req.headers['authorization'];
            if (auth) {
              console.log('sniffed_auth_token:', auth);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            let body = [];
            proxyRes.on('data', (chunk) => {
              body.push(chunk);
            });
            proxyRes.on('end', () => {
              try {
                const responseString = Buffer.concat(body).toString();
                console.log(`Response status from ${req.url}: ${proxyRes.statusCode}`);
              } catch (e) {
                console.log('Error printing proxy response body:', e);
              }
            });
          });
        },
      },
      '/zoom': {
        target: 'https://zoom.us',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zoom/, ''),
        headers: {
          'Origin': 'https://zoom.us',
          'Referer': 'https://zoom.us'
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Zoom proxy error', err);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            proxyRes.headers['access-control-allow-origin'] = '*';
          });
        }
      }
    }
  }
});
