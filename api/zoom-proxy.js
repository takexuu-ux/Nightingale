import https from 'https';
import { URL } from 'url';
import zlib from 'zlib';

function decompress(buffer, contentEncoding) {
  if (!contentEncoding) return buffer;
  const encoding = contentEncoding.trim().toLowerCase();
  if (encoding.includes('gzip')) {
    return zlib.gunzipSync(buffer);
  } else if (encoding.includes('deflate')) {
    return zlib.inflateSync(buffer);
  } else if (encoding.includes('br')) {
    return zlib.brotliDecompressSync(buffer);
  }
  return buffer;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  // 1. Extract path, subdomain, and other query parameters
  const { path, subdomain, ...queryParams } = req.query;
  
  // Reconstruct target path and host. For captcha requests, parse referer to use the correct Zoom subdomain.
  const urlObj = new URL(req.url, 'http://localhost');
  const pathname = urlObj.pathname;
  let cleanPath = path || '';
  
  let refererSubdomain = null;
  const referer = req.headers['referer'];
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (refUrl.pathname.startsWith('/zoom-subdomain/')) {
        const match = refUrl.pathname.match(/^\/zoom-subdomain\/([a-z0-9\-]+)/i);
        if (match) {
          refererSubdomain = match[1];
        }
      }
    } catch (e) {}
  }

  let host = subdomain ? `${subdomain}.zoom.us` : 'zoom.us';

  const isCaptcha = pathname.startsWith('/captcha-image') || pathname.startsWith('/captcha-audio') || pathname.startsWith('/captcha');
  const isCsrf = pathname.startsWith('/csrf_js') || pathname.startsWith('/csrf_data') || pathname.startsWith('/csrf');

  if (isCaptcha || isCsrf) {
    host = refererSubdomain ? `${refererSubdomain}.zoom.us` : 'zoom.us';
    cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  }

  if (cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  
  const targetUrl = new URL(`https://${host}/${cleanPath}`);
  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => targetUrl.searchParams.append(key, v));
    } else {
      targetUrl.searchParams.append(key, value);
    }
  }

  // 3. Prepare headers for the target request
  const headers = { ...req.headers };
  
  // Strip proxy/forwarding/Vercel headers that leak serverless origin to Zoom's security system
  for (const key of Object.keys(headers)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.startsWith('x-vercel-') || 
      lowerKey.startsWith('x-forwarded-') || 
      lowerKey.startsWith('x-real-') ||
      lowerKey === 'forwarded' || 
      lowerKey === 'via'
    ) {
      delete headers[key];
    }
  }
  
  // Override headers to simulate requests originating from target host
  headers['host'] = host;
  headers['origin'] = `https://${host}`;
  
  const isAsset = /\.(js|css|wasm|png|jpg|jpeg|gif|svg|woff2?|ttf|otf|mp4|webm|wav|mp3|json)$/i.test(cleanPath || '');
  if (!isAsset) {
    delete headers['accept-encoding']; // Force uncompressed response for pages/apis to allow safe HTML interception
  }
  
  if (headers['referer']) {
    try {
      const refUrl = new URL(headers['referer']);
      refUrl.host = host;
      refUrl.protocol = 'https:';
      headers['referer'] = refUrl.toString();
    } catch (e) {
      headers['referer'] = `https://${host}/`;
    }
  } else {
    headers['referer'] = `https://${host}/`;
  }

  const INJECTED_SCRIPT = `
(function() {
  // Override alert to silent OWASP CSRFGuard warnings
  var originalAlert = window.alert;
  window.alert = function(msg) {
    if (typeof msg === 'string' && msg.indexOf('OWASP CSRFGuard') !== -1) {
      console.warn('[Zoom-Injected] Blocked OWASP alert:', msg);
      return;
    }
    return originalAlert.apply(this, arguments);
  };

  console.log('[Zoom-Injected] Script successfully loaded inside Zoom iframe!', window.location.href);

  function remoteLog(type, msg) {
    console.log('[Injected-' + type + ']', msg);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '[Zoom-Injected-' + type + '] ' + msg
    }).catch(function() {});
  }

  window.onerror = function(message, source, lineno, colno, error) {
    remoteLog('error', 'Uncaught Exception: ' + message + ' at ' + source + ':' + lineno + ':' + colno + (error ? ' | ' + error.stack : ''));
    return false;
  };
  window.onunhandledrejection = function(event) {
    remoteLog('error', 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.message || event.reason : 'unknown'));
  };

  // Intercept and sanitize window.postMessage calls to fix "Invalid target origin" errors
  var originalPostMessage = window.postMessage;
  window.postMessage = function(message, targetOrigin, transfer) {
    var cleanedOrigin = targetOrigin;
    if (typeof targetOrigin === 'string' && targetOrigin.indexOf('/') !== -1) {
      if (targetOrigin.indexOf('http') === 0) {
        try {
          var u = new URL(targetOrigin);
          cleanedOrigin = u.origin;
        } catch (e) {
          cleanedOrigin = '*';
        }
      } else if (targetOrigin.indexOf('/') === 0) {
        cleanedOrigin = window.location.origin;
      }
    }
    try {
      if (transfer) {
        return originalPostMessage.call(this, message, cleanedOrigin, transfer);
      } else {
        return originalPostMessage.call(this, message, cleanedOrigin);
      }
    } catch (e) {
      try {
        return originalPostMessage.call(this, message, '*', transfer);
      } catch (err) {}
    }
  };

  // Intercept WebSocket connections to rewrite Zoom's wss:// URLs to use our proxy origin
  var OriginalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    remoteLog('log', 'Intercepted WebSocket connection request to: ' + url);
    var modifiedUrl = url;
    if (typeof url === 'string') {
      if (url.indexOf('wss://') === 0) {
        var withoutWss = url.substring(6);
        var slashIdx = withoutWss.indexOf('/');
        var host = slashIdx !== -1 ? withoutWss.substring(0, slashIdx) : withoutWss;
        var path = slashIdx !== -1 ? withoutWss.substring(slashIdx) : '';
        if (host.endsWith('.zoom.us')) {
          var subdomain = host.substring(0, host.length - 8);
          modifiedUrl = 'ws://' + window.location.host + '/zoom-subdomain/' + subdomain + path;
        } else if (host === 'zoom.us') {
          modifiedUrl = 'ws://' + window.location.host + '/zoom' + path;
        }
      }
    }
    remoteLog('log', 'Routing WebSocket connection through proxy: ' + modifiedUrl);
    try {
      return protocols ? new OriginalWebSocket(modifiedUrl, protocols) : new OriginalWebSocket(modifiedUrl);
    } catch (e) {
      remoteLog('error', 'Failed to construct WebSocket: ' + e.message);
      throw e;
    }
  };
  window.WebSocket.prototype = OriginalWebSocket.prototype;
  for (var key in OriginalWebSocket) {
    if (OriginalWebSocket.hasOwnProperty(key)) {
      window.WebSocket[key] = OriginalWebSocket[key];
    }
  }

  var originalConsoleError = console.error;
  console.error = function() {
    var args = Array.prototype.slice.call(arguments);
    remoteLog('error', 'Console Error: ' + args.join(' '));
    originalConsoleError.apply(console, arguments);
  };
  var originalConsoleWarn = console.warn;
  console.warn = function() {
    var args = Array.prototype.slice.call(arguments);
    remoteLog('warn', 'Console Warn: ' + args.join(' '));
    originalConsoleWarn.apply(console, arguments);
  };

  remoteLog('log', 'Automation script active. Path: ' + window.location.pathname);

  var attempts = 0;
  var audioClicked = false;
  var interval = setInterval(function() {
    attempts++;

    // Stop pre-join automation once inside the meeting
    var hasJoined = document.querySelector('button[class*="leave" i]') || 
                    document.querySelector('.footer-button-base__img-layout') ||
                    document.querySelector('.meet-layout');
    if (hasJoined) {
      clearInterval(interval);
      remoteLog('log', 'Meeting UI joined. Terminating pre-join automation loop.');
      return;
    }

    // STEP A: Check for audio join button FIRST — appears after joining, before any return
    if (!audioClicked) {
      var allPageEls = Array.from(document.querySelectorAll('button, input[type="button"], a, [role="button"], div, span'));
      var audioBtn = allPageEls.find(function(el) {
        var text = (el.textContent || el.value || '').trim().toLowerCase();
        return (text.includes('join audio by computer') ||
                text.includes('join with computer audio') ||
                text.includes('join computer audio') ||
                text === 'computer audio' ||
                text.includes('audio by computer')) &&
               el.children.length < 3;
      });
      if (audioBtn) {
        if (audioBtn.disabled || audioBtn.classList.contains('disabled') || audioBtn.getAttribute('disabled') !== null) {
          audioBtn.disabled = false;
          audioBtn.removeAttribute('disabled');
          audioBtn.classList.remove('disabled');
        }
        var nowA = Date.now();
        var lastClickA = parseInt(audioBtn.dataset.lastClicked || '0', 10);
        if (nowA - lastClickA > 3000) {
          audioBtn.dataset.lastClicked = String(nowA);
          remoteLog('log', 'Found audio button: "' + audioBtn.textContent.trim() + '". Auto-clicking!');
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
          audioClicked = true;
          setTimeout(function() { clearInterval(interval); remoteLog('log', 'Audio joined. Automation complete.'); }, 4000);
        }
        return;
      }
    }

    // STEP B: Auto-click recording consent OK button if it appears
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

    // STEP C: Fill pre-join form inputs
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
        remoteLog('log', 'No form inputs (attempt ' + attempts + '). Meeting loading...');
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
    var urlPasscode = urlParams.get('pwd') || '';
    var urlUserName = urlParams.get('un') || urlParams.get('uname') || '';

    if (urlPasscode) {
      sessionStorage.setItem('nnl_zoom_pwd', urlPasscode);
    }
    if (urlUserName) {
      sessionStorage.setItem('nnl_zoom_un', urlUserName);
    }

    var passcode = urlPasscode || sessionStorage.getItem('nnl_zoom_pwd') || '';
    var RANDOM_NAMES = ['Aarav','Amit','Rahul','Vikram','Ananya','Neha','Pooja','Rohan','Karan','Siddharth','Aditya','Riya','Sneha','Kabir','Dev','Rudra','Kunal','Abhishek','Priya','Deepak','Sanjay','Manish','Alok'];
    var persistedName = sessionStorage.getItem('nnl_randomized_username');
    if (!persistedName) {
      persistedName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      sessionStorage.setItem('nnl_randomized_username', persistedName);
    }
    var fallbackName = persistedName;
    var userName = urlUserName || sessionStorage.getItem('nnl_zoom_un') || fallbackName;
    if (userName.toLowerCase() === 'rajit') {
      userName = fallbackName;
    }

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

    // Check for captcha. If present, don't simulate click on the join button so the user can fill it.
    var hasCaptcha = false;
    var captchaInput = document.querySelector('input[name*="captcha" i], input[id*="captcha" i], input[placeholder*="captcha" i]');
    if (captchaInput) {
      hasCaptcha = true;
    }
    var captchaSelectors = [
      '[class*="captcha" i]', '[id*="captcha" i]',
      'iframe[src*="recaptcha" i]', 'iframe[src*="captcha" i]', 'iframe[src*="challenge" i]',
      '.g-recaptcha', '#recaptcha', '#captcha'
    ];
    for (var i = 0; i < captchaSelectors.length; i++) {
      var elements = document.querySelectorAll(captchaSelectors[i]);
      for (var j = 0; j < elements.length; j++) {
        try {
          var style = window.getComputedStyle(elements[j]);
          if (style.display !== 'none' && style.visibility !== 'hidden') {
            hasCaptcha = true;
            break;
          }
        } catch (e) {
          hasCaptcha = true;
          break;
        }
      }
      if (hasCaptcha) break;
    }

    if (joinBtn && isNameReady && isPasscodeReady) {
      if (hasCaptcha) {
        if (attempts % 30 === 0) {
          remoteLog('log', 'Captcha detected on page. Suspending automatic join button click to let user solve it.');
        }
        return;
      }
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

  }, 250);
})();
`;

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

      // Set COOP and COEP headers to enable SharedArrayBuffer/WebAssembly for Zoom inside the iframe
      responseHeaders['cross-origin-opener-policy'] = 'same-origin';
      responseHeaders['cross-origin-embedder-policy'] = 'credentialless';

      if (reqPath.includes('csrf_js')) {
        delete responseHeaders['etag'];
        delete responseHeaders['last-modified'];
        responseHeaders['cache-control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        responseHeaders['pragma'] = 'no-cache';
        responseHeaders['expires'] = '0';
      }

      // Rewrite Location redirect headers to point to our proxy instead of zoom.us / subdomains
      if (responseHeaders['location']) {
        responseHeaders['location'] = responseHeaders['location']
          .replace(/^https:\/\/zoom\.us\//i, '/zoom/')
          .replace(/^https:\/\/([a-z0-9\-]+)\.zoom\.us\//i, '/zoom-subdomain/$1/');
      }

      // Strip domain parameter from Set-Cookie so the browser binds them to our domain
      if (responseHeaders['set-cookie']) {
        const stripCookie = (cookie) => {
          let c = cookie
            .replace(/domain=\.?[a-z0-9\-]+\.zoom\.us;?\s*/gi, '')
            .replace(/domain=\.?zoom\.us;?\s*/gi, '');
          
          // Force SameSite=None and Secure for cross-site iframe compatibility
          if (!c.toLowerCase().includes('samesite=')) {
            c = c.trim().endsWith(';') ? `${c} SameSite=None;` : `${c}; SameSite=None;`;
          } else {
            c = c.replace(/samesite=[a-z]+/gi, 'SameSite=None');
          }
          if (!c.toLowerCase().includes('secure')) {
            c = c.trim().endsWith(';') ? `${c} Secure;` : `${c}; Secure;`;
          }
          return c;
        };
        if (Array.isArray(responseHeaders['set-cookie'])) {
          responseHeaders['set-cookie'] = responseHeaders['set-cookie'].map(stripCookie);
        } else if (typeof responseHeaders['set-cookie'] === 'string') {
          responseHeaders['set-cookie'] = stripCookie(responseHeaders['set-cookie']);
        }
      }

      const contentType = responseHeaders['content-type'] || '';
      const isHtml = contentType.includes('text/html');
      // Resolve path using req.url or cleanPath
      const reqPath = cleanPath || '';
      const isJs = contentType.includes('javascript') || reqPath.endsWith('.js') || reqPath.includes('csrf_js');
      const isJson = contentType.includes('json') || reqPath.endsWith('.json');

      if (isHtml || isJs || isJson) {
        const chunks = [];
        proxyRes.on('data', (chunk) => {
          chunks.push(chunk);
        });
        proxyRes.on('end', () => {
          let bodyBuffer = Buffer.concat(chunks);

          // Decompress if needed
          const contentEncoding = responseHeaders['content-encoding'];
          if (contentEncoding) {
            try {
              bodyBuffer = decompress(bodyBuffer, contentEncoding);
              delete responseHeaders['content-encoding'];
            } catch (e) {
              console.error(`Decompression failed for ${reqPath}:`, e.message);
            }
          }

          let bodyString = bodyBuffer.toString('utf8');

          // Bypass OWASP CSRFGuard domain verification check
          bodyString = bodyString.replace(/isValidDomain\(document\.domain,\s*[^)]+\)/g, 'true');

          // 1. Rewrite absolute Zoom URLs in the response body to our proxy paths.
          // IMPORTANT: JS/JSON files must get absolute origin URLs so Zoom's internal
          // `new URL(someVar)` calls never throw "Invalid URL" (relative paths need a base).
          // On Vercel we use the request origin; locally this is http://localhost:5173.
          const requestOrigin = (req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host'] || req.headers['host']}` : `http://${req.headers['host']}`) || 'http://localhost:5173';
          if (isJs || isJson) {
            bodyString = bodyString
              .replace(/https:\/\/([a-z0-9\-]+)\.zoom\.us/g, `${requestOrigin}/zoom-subdomain/$1`)
              .replace(/https:\\\/\\\/([a-z0-9\-]+)\.zoom\.us/g, `${requestOrigin.replace(/\//g, '\\/')}\\/zoom-subdomain\\/$1`)
              .replace(/https:\/\/zoom\.us/g, `${requestOrigin}/zoom`)
              .replace(/https:\\\/\\\/zoom\.us/g, `${requestOrigin.replace(/\//g, '\\/')}\\/zoom`);
          } else {
            bodyString = bodyString
              .replace(/https:\/\/([a-z0-9\-]+)\.zoom\.us/g, `${requestOrigin}/zoom-subdomain/$1`)
              .replace(/https:\\\/\\\/([a-z0-9\-]+)\.zoom\.us/g, `${requestOrigin.replace(/\//g, '\\/')}\\/zoom-subdomain\\/$1`)
              .replace(/https:\/\/zoom\.us/g, `${requestOrigin}/zoom`)
              .replace(/https:\\\/\\\/zoom\.us/g, `${requestOrigin.replace(/\//g, '\\/')}\\/zoom`);
          }

          if (isHtml) {
            // Force the browser to bypass cache for the security scripts
            bodyString = bodyString.replace(/src=['"]\/csrf_js([^'"]*)['"]/gi, `src="/csrf_js$1&_cb=${Date.now()}"`);

            // 2. For HTML responses, inject our auto-joining script
            const scriptTag = `<script>\n${INJECTED_SCRIPT}\n</script>`;
            if (bodyString.includes('<head>')) {
              bodyString = bodyString.replace('<head>', `<head>\n${scriptTag}`);
            } else if (bodyString.includes('<body>')) {
              bodyString = bodyString.replace('<body>', `<body>\n${scriptTag}`);
            } else {
              bodyString = scriptTag + bodyString;
            }
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
        // Apply headers to the response
        for (const [key, value] of Object.entries(responseHeaders)) {
          res.setHeader(key, value);
        }
        // Pipe the response stream back to the client
        proxyRes.pipe(res);
      }
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Zoom proxy request error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  });

  // Pipe the request body (if any) into the proxy request
  req.pipe(proxyReq);
}

