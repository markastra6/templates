#!/usr/bin/env bash
# Exercise the actual Linux network namespace with a synthetic HTTPS origin.
set -euo pipefail
scratch=$(mktemp -d)
cleanup() {
  sudo ip address del 1.1.1.1/32 dev lo || true
  sudo sed -i '/ # templates-audit-fixture$/d' /etc/hosts
  rm -rf -- "$scratch"
}
# The route exists on this ephemeral test runner before the proxy starts.
sudo ip address add 1.1.1.1/32 dev lo
trap cleanup EXIT
echo '1.1.1.1 audit-fixture.example # templates-audit-fixture' | sudo tee -a /etc/hosts >/dev/null
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj '/CN=audit-fixture.example' \
  -addext 'subjectAltName=DNS:audit-fixture.example' -keyout "$scratch/key" -out "$scratch/ca" 2>/dev/null
# Limit the unprivileged TLS fixture to the capability needed to bind port 443.
sudo systemd-run --unit=templates-test-tls --property="User=$(id -un)" \
  --property=AmbientCapabilities=CAP_NET_BIND_SERVICE \
  /usr/bin/python3 "$PWD/tests/fixture_https.py" "$scratch/ca" "$scratch/key"
trap 'sudo systemctl stop templates-test-tls || true; cleanup' EXIT
for _ in {1..50}; do
  if curl --noproxy '*' --silent --fail --cacert "$scratch/ca" https://audit-fixture.example/ >/dev/null; then break; fi
  sleep .1
done
curl --noproxy '*' --silent --show-error --fail --cacert "$scratch/ca" https://audit-fixture.example/ || { sudo journalctl -u templates-test-tls --no-pager; exit 1; }
AUDIT_CA="$scratch/ca" AUDIT_HOST=audit-fixture.example TARGET_URL=https://audit-fixture.example/ \
  bash scripts/run_isolated_audit.sh probe
