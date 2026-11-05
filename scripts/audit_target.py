"""Resolve the explicitly authorized audit host once before entering isolation."""
import ipaddress
import socket
import sys
from urllib.parse import urlsplit

from validate_public_url import validate_public_https_url


def pinned_target(url, allowed_host):
    validate_public_https_url(url)
    host = urlsplit(url).hostname.encode("idna").decode("ascii").lower()
    if host != allowed_host.strip().lower() or not allowed_host:
        raise ValueError("Target must match the authorized AUDIT_HOST")
    records = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    addresses = [ipaddress.ip_address(item[4][0]) for item in records]
    if not addresses or any(not ip.is_global or ip.is_multicast for ip in addresses):
        raise ValueError("Target did not resolve exclusively to public unicast addresses")
    return host, min(addresses, key=lambda ip: ip.version)


if __name__ == "__main__":
    print(*pinned_target(sys.argv[1], sys.argv[2]))
