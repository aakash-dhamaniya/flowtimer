import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
PORT = 8000
APK_NAME = "flowtimer.apk"
APK_PATH = os.path.join(DIRECTORY, APK_NAME)

class APKDownloadHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Custom mobile landing page if root is visited
        if self.path == "/" or self.path == "":
            file_size_mb = os.path.getsize(APK_PATH) / (1024 * 1024) if os.path.exists(APK_PATH) else 0
            html = f"""<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Download FlowTimer APK</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{
            background-color: #080A0F;
            color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 24px 20px;
            text-align: center;
        }}
        .card {{
            background: #111520;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 32px 24px;
            max-width: 380px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }}
        .logo {{
            width: 64px;
            height: 64px;
            border-radius: 18px;
            background: #192030;
            border: 1px solid rgba(255,255,255,0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
        }}
        h1 {{
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 6px 0;
            letter-spacing: -0.5px;
        }}
        .badge {{
            display: inline-block;
            background: rgba(245, 158, 11, 0.15);
            color: #F59E0B;
            border: 1px solid rgba(245, 158, 11, 0.3);
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }}
        .btn {{
            display: block;
            background-color: #F59E0B;
            color: #000000;
            font-weight: 800;
            font-size: 16px;
            padding: 18px 24px;
            border-radius: 16px;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
            transition: transform 0.1s ease;
        }}
        .btn:active {{
            transform: scale(0.97);
        }}
        .meta {{
            color: #94A3B8;
            font-size: 13px;
            margin-top: 14px;
            font-family: monospace;
        }}
        .steps {{
            margin-top: 24px;
            text-align: left;
            background: #192030;
            border-radius: 16px;
            padding: 16px;
            font-size: 12px;
            color: #CBD5E1;
            line-height: 1.6;
        }}
        .steps ol {{
            margin: 0;
            padding-left: 20px;
        }}
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="13" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2.5" stroke-dasharray="2 3"/>
                <circle cx="18" cy="18" r="13" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="25 60" stroke-linecap="round"/>
                <polygon points="15,12 24,18 15,24" fill="#F59E0B" />
            </svg>
        </div>
        <h1>FlowTimer</h1>
        <div class="badge">Tactile Chronometer Redesign</div>
        
        <a href="/flowtimer.apk" class="btn" download="flowtimer.apk">
            Download APK ({file_size_mb:.0f} MB)
        </a>
        <div class="meta">Target: aarch64 (Android 8+)</div>

        <div class="steps">
            <strong>Install Instructions:</strong>
            <ol>
                <li>Tap <strong>Download APK</strong> above.</li>
                <li>When download finishes, tap the notification.</li>
                <li>Tap <strong>Install</strong> (allow <em>Unknown Sources</em> if prompted).</li>
            </ol>
        </div>
    </div>
</body>
</html>"""
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(html.encode("utf-8"))))
            self.end_headers()
            self.wfile.write(html.encode("utf-8"))
            return

        # Add APK MIME type and attachment disposition for .apk
        if self.path.endswith(".apk"):
            self.extensions_map.update({
                '.apk': 'application/vnd.android.package-archive',
            })

        return super().do_GET()

    def end_headers(self):
        if self.path.endswith(".apk"):
            self.send_header("Content-Disposition", 'attachment; filename="flowtimer.apk"')
        super().end_headers()

def run():
    server = HTTPServer(("0.0.0.0", PORT), APKDownloadHandler)
    print(f"APK download server active on http://0.0.0.0:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run()
