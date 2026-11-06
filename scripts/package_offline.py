#!/usr/bin/env python3
"""Create a verified, offline, zero-dependency zip from an already-built site."""
from __future__ import annotations
import argparse
import hashlib
import io
import json
from pathlib import Path
import zipfile

WINDOWS = r"""@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
    py -3 -m http.server 8080 --bind 127.0.0.1 --directory site
) else (
    python -m http.server 8080 --bind 127.0.0.1 --directory site
)
echo Open http://127.0.0.1:8080/app-blueprint.html
pause
"""
MACOS = """#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf '%s\\n' 'Open http://127.0.0.1:8080/app-blueprint.html in a browser'
exec python3 -m http.server 8080 --bind 127.0.0.1 --directory site
"""
README = """Offline UI Workbench
====================
Start_Workbench.bat (Windows) or Start_Workbench.command (macOS) starts a local
HTTP server on 127.0.0.1:8080. Open http://127.0.0.1:8080/
Python 3 is required. No Node.js, npm, external hosting or internet is needed
for running the prebuilt catalogue, explorer, labs or blueprint editor.
The Windows launcher does not open a browser automatically; the displayed URL
is the entry point. If port 8080 is in use, close the conflicting server.
Do not use these tools to store secrets in browser-local projects.
The archive is not a signed Windows executable, macOS app, or Android APK.
"""
def package(site: Path, destination: Path) -> None:
    if not site.is_dir() or not (site / "index.html").is_file() or not (site / "ui-index.json").is_file():
        raise ValueError("Build the complete site first (npm run build): index.html/ui-index.json missing")
    files = sorted(p for p in site.rglob("*") if p.is_file())
    entries = {}
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for p in files:
            rel = p.relative_to(site).as_posix()
            if p.is_symlink() or ".." in Path(rel).parts:
                raise ValueError("Unsafe site file: " + rel)
            data = p.read_bytes()
            entries["site/" + rel] = hashlib.sha256(data).hexdigest()
            archive.writestr("site/" + rel, data)
        for name, data in [("Start_Workbench.bat", WINDOWS), ("Start_Workbench.command", MACOS), ("README-OFFLINE.txt", README)]:
            raw = data.encode("utf-8")
            entries[name] = hashlib.sha256(raw).hexdigest()
            info = zipfile.ZipInfo(name)
            if name.endswith(".command"):
                info.external_attr = (0o100755 << 16)
            archive.writestr(info, raw)
        archive.writestr("SHA256-MANIFEST.json", json.dumps(entries, sort_keys=True, indent=2) + "\n")
    with zipfile.ZipFile(destination) as archive:
        if archive.testzip() is not None:
            raise RuntimeError("ZIP CRC verification failed")
        stored = json.loads(archive.read("SHA256-MANIFEST.json"))
        if stored.keys() != entries.keys() or any(
            hashlib.sha256(archive.read(name)).hexdigest() != checksum
            for name, checksum in stored.items()
        ):
            raise RuntimeError("ZIP SHA-256 verification failed")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path("dist/site"))
    parser.add_argument("--out", type=Path, default=Path("dist/ui-workbench-offline.zip"))
    args = parser.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    package(args.site, args.out)
    print(f"Verified archive: {args.out} ({args.out.stat().st_size} bytes)")
