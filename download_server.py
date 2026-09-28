import os
from http.server import HTTPServer, BaseHTTPRequestHandler

FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DESIGN.md")
PORT = 8000

class ForceDownloadHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not os.path.exists(FILE_PATH):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"File not found.")
            return

        with open(FILE_PATH, "rb") as f:
            file_bytes = f.read()

        # Check if browser wants direct download or landing page
        if self.path == "/" or self.path == "":
            html = f"""<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downloading DESIGN.md</title>
    <style>
        body {{
            background-color: #090D16;
            color: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }}
        .btn {{
            background-color: #F59E0B;
            color: #000000;
            font-weight: bold;
            font-size: 18px;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            display: inline-block;
            margin-top: 24px;
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
        }}
        .subtext {{
            color: #94A3B8;
            font-size: 14px;
            margin-top: 12px;
        }}
    </style>
</head>
<body>
    <h2>FlowTimer Design Spec</h2>
    <p>Your download should start automatically...</p>
    <a href="/download" class="btn" download="DESIGN.md">Tap Here to Download DESIGN.md</a>
    <p class="subtext">Size: {len(file_bytes) / 1024:.1f} KB • Format: Markdown</p>
    <script>
        setTimeout(function() {{
            window.location.href = "/download";
        }}, 500);
    </script>
</body>
</html>"""
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(html.encode("utf-8"))))
            self.end_headers()
            self.wfile.write(html.encode("utf-8"))
            return

        # Force download stream with attachment disposition
        self.send_response(200)
        self.send_header("Content-Type", "application/octet-stream")
        self.send_header("Content-Disposition", 'attachment; filename="DESIGN.md"')
        self.send_header("Content-Length", str(len(file_bytes)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.end_headers()
        self.wfile.write(file_bytes)

def run():
    server = HTTPServer(("0.0.0.0", PORT), ForceDownloadHandler)
    print(f"Server started on port {PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run()
