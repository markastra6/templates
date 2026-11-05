"""HTTPS redirect fixture used on ephemeral Linux CI runners."""
import ssl
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/redirect":
            self.send_response(302)
            self.send_header("Location", "https://169.254.169.254/")
        else:
            self.send_response(200)
        self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("1.1.1.1", 443), Handler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(sys.argv[1], sys.argv[2])
    server.socket = context.wrap_socket(server.socket, server_side=True)
    server.serve_forever()
