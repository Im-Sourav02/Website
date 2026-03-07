import { NextRequest, NextResponse } from 'next/server';

// import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, target } = body;

    if (!token || !target) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    // 1. Secretly verify the Turnstile Token with Cloudflare
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const formData = new URLSearchParams();

    // PASTE YOUR CLOUDFLARE SECRET KEY HERE
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    formData.append('response', token);

    const cfResponse = await fetch(verifyUrl, {
      method: 'POST',
      body: formData,
    });
    const cfData = await cfResponse.json();

    // If Cloudflare rejects the token, block the redirect
    if (!cfData.success) {
      return NextResponse.json({ success: false, error: 'Bot detected' }, { status: 403 });
    }

    // 2. If verified as human, safely decode the Base64 link on the server
    const decodedUrl = Buffer.from(target, 'base64').toString('utf-8');

    // 3. Send the real URL back to the frontend safely
    return NextResponse.json({ success: true, url: decodedUrl });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const encodedTarget = url.searchParams.get('to');
  const userAgent = request.headers.get('User-Agent') || '';

  // --- Device & Browser Detection ---
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  // Detect non-Chrome Android browsers (Telegram WebView, Brave, Firefox, Samsung, etc.)
  const isTelegramWebView = /Telegram/i.test(userAgent);
  const isAndroidWebView = /wv\b|WebView/i.test(userAgent) || isTelegramWebView;
  const isAndroidChrome =
    /Chrome\//.test(userAgent) &&
    !/EdgA|OPR|Brave|SamsungBrowser|YaBrowser|UCBrowser|Firefox/i.test(userAgent) &&
    !isAndroidWebView;

  // On iOS: detect non-Chrome browsers (Telegram, Safari, Brave iOS, etc.)
  const isIOSChrome = /CriOS/i.test(userAgent);

  // If someone visits without a link, show a welcome screen
  if (!encodedTarget) {
    return new NextResponse('🔥 Welcome 2 sukuna.site\n\nYour Secure Redirect System is Online.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const decodedTarget = Buffer.from(encodedTarget, 'base64').toString('utf-8');
    const targetUrl = new URL(decodedTarget);
    const fallbackUrl = encodeURIComponent(decodedTarget);

    let breakoutScript = '';

    if (isAndroid) {
      if (isAndroidChrome) {
        // Already in Chrome — just redirect
        breakoutScript = `window.location.replace("${decodedTarget}");`;
      } else {
        // Telegram WebView, Brave, Firefox, Samsung, any other Android browser
        const intentPath = targetUrl.host + targetUrl.pathname + targetUrl.search;
        const intentUrl = `intent://${intentPath}#Intent;scheme=${targetUrl.protocol.replace(':', '')};package=com.android.chrome;S.browser_fallback_url=${fallbackUrl};end`;

        breakoutScript = `
          window.location.replace("${intentUrl}");
          setTimeout(() => {
            const box = document.getElementById('step-countdown');
            if (box) {
              box.innerHTML = \`
                <div class="status-text" style="margin-bottom:14px;">Tap below to open in Chrome</div>
                <a href="${intentUrl}" 
                   style="background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;
                          text-decoration:none;font-weight:bold;display:inline-block;
                          box-shadow:0 4px 15px rgba(59,130,246,0.4);">
                  Open in Chrome
                </a>
              \`;
            }
          }, 2000);
        `;
      }
    } else if (isIOS) {
      if (isIOSChrome) {
        // Already in Chrome for iOS — just redirect
        breakoutScript = `window.location.replace("${decodedTarget}");`;
      } else {
        // Telegram iOS, Safari, Brave iOS, etc.
        const chromeSchemeUrl = decodedTarget
          .replace(/^https:\/\//i, 'googlechromes://')
          .replace(/^http:\/\//i, 'googlechrome://');

        breakoutScript = `
          window.location.replace("${chromeSchemeUrl}");
          setTimeout(() => {
            const box = document.getElementById('step-countdown');
            if (box) {
              box.innerHTML = \`
                <div class="status-text" style="margin-bottom:14px;">Tap below to open in Chrome</div>
                <a href="${chromeSchemeUrl}"
                   style="background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;
                          text-decoration:none;font-weight:bold;display:inline-block;
                          box-shadow:0 4px 15px rgba(59,130,246,0.4);">
                  Open in Chrome
                </a>
                <div class="status-text" style="margin-top:10px;font-size:12px;color:#9ca3af;">
                  Chrome must be installed
                </div>
              \`;
            }
          }, 2000);
        `;
      }
    } else {
      // Desktop — just redirect normally
      breakoutScript = `window.location.href = "${decodedTarget}";`;
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secure Redirect | sukuna.site</title>
        <style>
            body { background-color: #0b0f19; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .container { background: #111827; padding: 40px 30px; border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; width: 85%; max-width: 350px; }
            .icon-container { background: #1e3a8a; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; }
            .icon { font-size: 28px; }
            h2 { margin: 0 0 5px 0; font-size: 22px; font-weight: 600; }
            .subtitle { color: #9ca3af; font-size: 14px; margin-bottom: 30px; }
            .box { background: #0b0f19; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; position: relative; margin-bottom: 15px; min-height: 80px; display: flex; flex-direction: column; justify-content: center; align-items: center; }

            .loader { border: 3px solid #1f2937; border-top: 3px solid #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 15px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            .countdown-circle { width: 60px; height: 60px; border-radius: 50%; border: 3px solid #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px auto; color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); }
            .status-text { font-size: 15px; color: #d1d5db; font-weight: 500; }

            .dest-box { background: #0b0f19; border: 1px solid #1f2937; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
            .dest-label { color: #9ca3af; font-size: 12px; display: flex; align-items: center; gap: 6px; font-weight: 700; letter-spacing: 0.5px; }
            .dest-link { color: #ffffff; font-weight: 600; font-size: 13px; background: #111827; padding: 6px 12px; border-radius: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }

            .footer { margin-top: 30px; font-size: 12px; color: #4b5563; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
            .footer span { color: #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon-container">
                <div class="icon">🔒</div>
            </div>
            <h2>Secure Redirect</h2>
            <div class="subtitle">connection established</div>

            <div class="box" id="step-verify">
                <div class="loader"></div>
                <div class="status-text">Verifying security...</div>
            </div>

            <div class="box" id="step-countdown" style="display: none;">
                <div class="countdown-circle" id="timer">2</div>
                <div class="status-text">Opening in Chrome...</div>
            </div>

            <div class="dest-box">
                <div class="dest-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    DESTINATION
                </div>
                <div class="dest-link" title="${targetUrl.host}">${targetUrl.host}</div>
            </div>
        </div>

        <div class="footer">
            <span>●</span> SAFE REDIRECT IN PROGRESS
        </div>

        <script>
            setTimeout(() => {
                document.getElementById('step-verify').style.display = 'none';
                document.getElementById('step-countdown').style.display = 'flex';

                let timeLeft = 2;
                const timerEl = document.getElementById('timer');

                const countdown = setInterval(() => {
                    timeLeft--;
                    timerEl.textContent = timeLeft;
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        document.getElementById('step-countdown').innerHTML =
                            '<div class="loader"></div><div class="status-text">Opening Chrome...</div>';

                        // Execute the platform-specific Chrome breakout
                        ${breakoutScript}
                    }
                }, 1000);
            }, 1000);
        </script>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  } catch (e) {
    return new NextResponse('Invalid link format.', { status: 400 });
  }
}
