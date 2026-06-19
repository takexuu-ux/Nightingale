import { defineConfig } from 'vite';
import https from 'https';

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
      }
    }
  },
  plugins: [
    {
      name: 'zoom-proxy-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost:5173'));
          const isZoom = url.pathname.startsWith('/zoom');
          const isZoomSubdomain = url.pathname.startsWith('/zoom-subdomain');
          const isLog = url.pathname === '/api/log';

          // Print every incoming request to see what Zoom is requesting from localhost
          console.log('[VITE REQ]', req.method, req.url);

          if (!isZoom && !isZoomSubdomain && !isLog) {
            return next();
          }

          if (isLog) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              console.log(body);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            });
            return;
          }

          let targetHost = 'zoom.us';
          let targetPath = '';

          if (isZoomSubdomain) {
            const match = url.pathname.match(/^\/zoom-subdomain\/([a-z0-9\-]+)(.*)/i);
            if (match) {
              targetHost = `${match[1]}.zoom.us`;
              targetPath = match[2];
            } else {
              targetHost = 'zoom.us';
              targetPath = url.pathname.slice(15);
            }
          } else {
            targetHost = 'zoom.us';
            targetPath = url.pathname.slice(5);
          }

          if (targetPath.endsWith('/')) {
            targetPath = targetPath.slice(0, -1);
          }

          const targetUrl = new URL(`https://${targetHost}${targetPath}${url.search}`);

          const headers = { ...req.headers };
          headers['host'] = targetHost;
          headers['origin'] = `https://${targetHost}`;

          const isAsset = /\.(js|css|wasm|png|jpg|jpeg|gif|svg|woff2?|ttf|otf|mp4|webm|wav|mp3|json)$/i.test(url.pathname);
          if (!isAsset) {
            delete headers['accept-encoding']; // Force uncompressed response for pages/apis to allow safe HTML interception
          }

          if (headers['referer']) {
            try {
              const refUrl = new URL(headers['referer']);
              refUrl.host = targetHost;
              refUrl.protocol = 'https:';
              headers['referer'] = refUrl.toString();
            } catch (e) {
              headers['referer'] = `https://${targetHost}/`;
            }
          } else {
            headers['referer'] = `https://${targetHost}/`;
          }

          const INJECTED_SCRIPT = `
(function() {
  console.log('[Zoom-Injected] Script successfully loaded inside Zoom iframe!', window.location.href);

  function remoteLog(type, msg) {
    console.log('[Injected-' + type + ']', msg);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '[Zoom-Injected-' + type + '] ' + msg
    }).catch(function() {});
  }

  remoteLog('log', 'Automation script active. Path: ' + window.location.pathname);

  var attempts = 0;
  var interval = setInterval(function() {
    attempts++;
    
    // 0. Auto-click recording consent OK button if it appears
    var okBtn = null;
    var allInteractive = Array.from(document.querySelectorAll('button, [role="button"], .zm-btn, a'));
    okBtn = allInteractive.find(function(el) {
      var text = (el.textContent || el.value || '').trim();
      return text === 'OK' || text === 'Got it' || text === 'Agree' || text === 'Continue';
    });
    if (!okBtn) {
      var divs = Array.from(document.querySelectorAll('div, span')).filter(function(el) {
        var text = (el.textContent || el.value || '').trim();
        return (text === 'OK' || text === 'Got it') && el.children.length === 0;
      });
      if (divs.length > 0) {
        okBtn = divs[0];
      }
    }
    if (okBtn) {
      var now = Date.now();
      var lastClick = parseInt(okBtn.dataset.lastClicked || '0', 10);
      if (now - lastClick > 1500) {
        okBtn.dataset.lastClicked = String(now);
        remoteLog('log', 'Found recording consent button! Clicking it.');
        okBtn.focus();
        try {
          okBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true }));
          okBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, isPrimary: true }));
        } catch (e) {}
        try {
          okBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          okBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          okBtn.click();
          okBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        } catch (e) {}
      }
    }

    var allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="password"], input:not([type])')).filter(function(input) {
      try {
        var style = window.getComputedStyle(input);
        return style.display !== 'none' && style.visibility !== 'hidden' && input.type !== 'hidden';
      } catch (e) {
        return true;
      }
    });

    if (allInputs.length === 0) {
      if (attempts % 30 === 0) {
        remoteLog('log', 'Still waiting for inputs inside iframe (attempt ' + attempts + ')...');
      }
      return;
    }

    var passcodeInput = allInputs.find(function(input) {
      var name = (input.name || '').toLowerCase();
      var id = (input.id || '').toLowerCase();
      var placeholder = (input.placeholder || '').toLowerCase();
      return name.includes('passcode') || id.includes('passcode') || 
             name.includes('password') || id.includes('password') ||
             placeholder.includes('passcode') || placeholder.includes('password') ||
             input.type === 'password';
    });

    var nameInput = allInputs.find(function(input) {
      var name = (input.name || '').toLowerCase();
      var id = (input.id || '').toLowerCase();
      var placeholder = (input.placeholder || '').toLowerCase();
      return (name.includes('name') || id.includes('name') || placeholder.includes('name')) && input !== passcodeInput;
    });

    if (!passcodeInput && !nameInput) {
      if (allInputs.length >= 2) {
        passcodeInput = allInputs[0];
        nameInput = allInputs[1];
      } else if (allInputs.length === 1) {
        nameInput = allInputs[0];
      }
    } else if (passcodeInput && !nameInput) {
      nameInput = allInputs.find(function(input) { return input !== passcodeInput; });
    } else if (!passcodeInput && allInputs.length >= 2 && nameInput) {
      passcodeInput = allInputs.find(function(input) { return input !== nameInput; });
    }

    var urlParams = new URLSearchParams(window.location.search);
    var passcode = urlParams.get('pwd') || '';
    var userName = urlParams.get('un') || urlParams.get('uname') || 'Rajit';

    if (passcodeInput && passcode) {
      if (!passcodeInput.value || passcodeInput.value !== passcode) {
        passcodeInput.focus();
        try {
          var prototype = Object.getPrototypeOf(passcodeInput);
          var descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
          if (descriptor && descriptor.set) {
            descriptor.set.call(passcodeInput, passcode);
          } else {
            passcodeInput.value = passcode;
          }
          var tracker = passcodeInput._valueTracker;
          if (tracker) tracker.setValue('');
        } catch (e) {
          passcodeInput.value = passcode;
        }
        passcodeInput.dispatchEvent(new Event('input', { bubbles: true }));
        passcodeInput.dispatchEvent(new Event('change', { bubbles: true }));
        remoteLog('log', 'Filled passcode inside iframe.');
      }
    }

    if (nameInput && userName) {
      if (!nameInput.value || nameInput.value !== userName) {
        nameInput.focus();
        try {
          var prototype = Object.getPrototypeOf(nameInput);
          var descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
          if (descriptor && descriptor.set) {
            descriptor.set.call(nameInput, userName);
          } else {
            nameInput.value = userName;
          }
          var tracker = nameInput._valueTracker;
          if (tracker) tracker.setValue('');
        } catch (e) {
          nameInput.value = userName;
        }
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        remoteLog('log', 'Filled name inside iframe: ' + userName);

        var checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }

    var joinBtn = document.querySelector('.preview-join-button') || 
                  document.querySelector('button.preview-join-button') ||
                  document.querySelector('button#joinBtn') ||
                  document.querySelector('button[class*="join" i]') ||
                  document.querySelector('button[id*="join" i]');

    var buttons = Array.from(document.querySelectorAll('button, input[type="button"], a, [role="button"], .join-btn, #join-btn'));
    if (!joinBtn) {
      joinBtn = buttons.find(function(btn) {
        var text = (btn.textContent || btn.value || '').trim().toLowerCase();
        return text === 'join' || text.includes('join meeting') || text.includes('join class') || btn.classList.contains('join-btn') || btn.id === 'join-btn';
      });
    }

    if (!joinBtn) {
      var allElements = Array.from(document.querySelectorAll('button, input[type="button"], a, [role="button"], div, span'));
      joinBtn = allElements.find(function(el) {
        var text = (el.textContent || el.value || '').trim().toLowerCase();
        if (text === 'join' || text === 'join meeting' || text === 'join class') {
          return el.querySelectorAll('div').length === 0;
        }
        return false;
      });
    }

    var isPasscodeReady = !passcodeInput || (passcodeInput.value && passcodeInput.value.length > 0);
    var isNameReady = nameInput && nameInput.value && nameInput.value.length > 1;

    if (joinBtn && isNameReady && isPasscodeReady) {
      if (joinBtn.disabled || joinBtn.classList.contains('disabled') || joinBtn.getAttribute('disabled') !== null) {
        joinBtn.disabled = false;
        joinBtn.removeAttribute('disabled');
        joinBtn.classList.remove('disabled');
      }

      var now = Date.now();
      var lastClick = parseInt(joinBtn.dataset.lastClicked || '0', 10);
      if (now - lastClick > 1500) {
        joinBtn.dataset.lastClicked = String(now);
        remoteLog('log', 'Found join button! Simulating click event.');
        joinBtn.focus();
        
        try {
          joinBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true }));
          joinBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, isPrimary: true }));
        } catch (e) {}

        try {
          joinBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          joinBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          joinBtn.click();
          joinBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        } catch (e) {}

        var form = joinBtn.closest('form');
        if (form) {
          try {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          } catch (e) {}
        }
      }
    }

    var audioBtn = buttons.find(function(btn) {
      var text = (btn.textContent || btn.value || '').trim().toLowerCase();
      return text.includes('join with computer audio') || 
             text.includes('join computer audio') || 
             text === 'computer audio' ||
             text.includes('join audio') ||
             text.includes('audio by computer');
    });

    if (audioBtn && audioBtn !== joinBtn) {
      if (audioBtn.disabled || audioBtn.classList.contains('disabled') || audioBtn.getAttribute('disabled') !== null) {
        audioBtn.disabled = false;
        audioBtn.removeAttribute('disabled');
        audioBtn.classList.remove('disabled');
      }

      var now = Date.now();
      var lastClick = parseInt(audioBtn.dataset.lastClicked || '0', 10);
      if (now - lastClick > 1500) {
        audioBtn.dataset.lastClicked = String(now);
        remoteLog('log', 'Found audio button! Simulating click event.');
        audioBtn.focus();

        try {
          audioBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true }));
          audioBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, isPrimary: true }));
        } catch (e) {}

        try {
          audioBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          audioBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          audioBtn.click();
          audioBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        } catch (e) {}
      }
    }
  }, 250);
})();
`;

          const proxyReq = https.request(
            targetUrl.toString(),
            {
              method: req.method,
              headers: headers,
            },
            (proxyRes) => {
              res.statusCode = proxyRes.statusCode;

              const responseHeaders = { ...proxyRes.headers };
              delete responseHeaders['x-frame-options'];
              delete responseHeaders['content-security-policy'];
              
              responseHeaders['access-control-allow-origin'] = '*';
              responseHeaders['access-control-allow-methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
              responseHeaders['access-control-allow-headers'] = '*';

              if (responseHeaders['location']) {
                responseHeaders['location'] = responseHeaders['location']
                  .replace(/^https:\/\/zoom\.us\//i, '/zoom/')
                  .replace(/^https:\/\/([a-z0-9\-]+)\.zoom\.us\//i, '/zoom-subdomain/$1/');
              }

              if (responseHeaders['set-cookie']) {
                const stripCookie = (cookie) => {
                  return cookie
                    .replace(/domain=\.?[a-z0-9\-]+\.zoom\.us;?\s*/gi, '')
                    .replace(/domain=\.?zoom\.us;?\s*/gi, '');
                };
                if (Array.isArray(responseHeaders['set-cookie'])) {
                  responseHeaders['set-cookie'] = responseHeaders['set-cookie'].map(stripCookie);
                } else if (typeof responseHeaders['set-cookie'] === 'string') {
                  responseHeaders['set-cookie'] = stripCookie(responseHeaders['set-cookie']);
                }
              }

              const contentType = responseHeaders['content-type'] || '';
              const isHtml = contentType.includes('text/html');

              console.log(`[VITE RES] ${proxyRes.statusCode} for ${req.method} ${req.url} (Type: ${contentType})`);

              if (isHtml) {
                const chunks = [];
                proxyRes.on('data', (chunk) => {
                  chunks.push(chunk);
                });
                proxyRes.on('end', () => {
                  const bodyBuffer = Buffer.concat(chunks);
                  let bodyString = bodyBuffer.toString('utf8');

                  // 1. Rewrite absolute Zoom URLs in the response body to our proxy paths
                  bodyString = bodyString
                    .replace(/https:\/\/([a-z0-9\-]+)\.zoom\.us/g, '/zoom-subdomain/$1')
                    .replace(/https:\\\/\\\/([a-z0-9\-]+)\.zoom\.us/g, '\\/zoom-subdomain\\/$1')
                    .replace(/https:\/\/zoom\.us/g, '/zoom')
                    .replace(/https:\\\/\\\/zoom\.us/g, '\\/zoom');

                  // 2. For HTML responses, inject our auto-joining script
                  const scriptTag = `<script>\n${INJECTED_SCRIPT}\n</script>`;
                  if (bodyString.includes('<head>')) {
                    bodyString = bodyString.replace('<head>', `<head>\n${scriptTag}`);
                  } else if (bodyString.includes('<body>')) {
                    bodyString = bodyString.replace('<body>', `<body>\n${scriptTag}`);
                  } else {
                    bodyString = scriptTag + bodyString;
                  }

                  const updatedBuffer = Buffer.from(bodyString, 'utf8');
                  responseHeaders['content-length'] = String(updatedBuffer.length);
                  delete responseHeaders['transfer-encoding']; // Prevent Content-Length vs Transfer-Encoding conflict

                  for (const [key, value] of Object.entries(responseHeaders)) {
                    res.setHeader(key, value);
                  }
                  res.end(updatedBuffer);
                });
              } else {
                for (const [key, value] of Object.entries(responseHeaders)) {
                  res.setHeader(key, value);
                }
                proxyRes.pipe(res);
              }
            }
          );

          proxyReq.on('error', (err) => {
            console.error('Local Zoom proxy request error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
          });

          req.pipe(proxyReq);
        });
      }
    }
  ]
});
