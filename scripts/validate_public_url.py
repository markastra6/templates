#!/usr/bin/env python3
"""Validate a user-supplied URL before running public-site audits.

This blocks common accidental SSRF targets. It is not a network sandbox: callers
should still only audit sites they trust and control.
"""

from __future__ import annotations

import ipaddress
import re
import socket
import sys
from urllib.parse import urlsplit


_BLOCKED_SUFFIXES = (".localhost", ".local", ".internal", ".test", ".invalid")


def validate_public_https_url(value: str) -> None:
    """Raise ValueError unless value is an HTTPS URL on a globally routed host."""
    if not value or value != value.strip():
        raise ValueError("provide a non-empty URL without surrounding whitespace")

    if any(ord(character) <= 0x20 or ord(character) == 0x7F for character in value):
        raise ValueError("whitespace and control characters are not allowed")
    if "\\" in value:
        raise ValueError("backslashes are not allowed")

    try:
        parsed = urlsplit(value)
        port = parsed.port
    except ValueError as exc:
        raise ValueError("URL authority or port is malformed") from exc

    if parsed.scheme.lower() != "https":
        raise ValueError("only HTTPS audit targets are allowed")
    if not parsed.netloc or not parsed.hostname:
        raise ValueError("URL must include a hostname")
    if parsed.username is not None or parsed.password is not None:
        raise ValueError("embedded credentials are not allowed")
    if parsed.fragment:
        raise ValueError("URL fragments are not needed for an audit target")
    if port not in (None, 443) or parsed.netloc.endswith(":"):
        raise ValueError("only the default HTTPS port (443) is allowed")

    hostname = parsed.hostname.rstrip(".").lower()
    if not hostname or hostname == "localhost" or hostname.endswith(_BLOCKED_SUFFIXES):
        raise ValueError("local and reserved hostnames are not allowed")

    try:
        ascii_hostname = hostname.encode("idna").decode("ascii")
    except UnicodeError as exc:
        raise ValueError("hostname is not valid IDNA") from exc

    try:
        literal_address = ipaddress.ip_address(ascii_hostname)
    except ValueError:
        if len(ascii_hostname) > 253:
            raise ValueError("hostname is too long")
        labels = ascii_hostname.split(".")
        if len(labels) < 2 or any(
            not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?", label)
            for label in labels
        ):
            raise ValueError("hostname must be a valid public DNS name")

        try:
            records = socket.getaddrinfo(hostname, 443, type=socket.SOCK_STREAM)
        except OSError as exc:
            raise ValueError("hostname did not resolve to a public address") from exc

        addresses = {
            ipaddress.ip_address(record[4][0].split("%", maxsplit=1)[0])
            for record in records
        }
        if not addresses:
            raise ValueError("hostname did not resolve to an address")
    else:
        addresses = {literal_address}

    if any(address.is_multicast or not address.is_global for address in addresses):
        raise ValueError("hostname resolves to a non-public, private, or reserved IP address")


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} https://public.example/", file=sys.stderr)
        return 2

    try:
        validate_public_https_url(sys.argv[1])
    except ValueError as exc:
        print(f"Invalid audit target: {exc}", file=sys.stderr)
        return 2

    print("Audit target is a public HTTPS URL.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
