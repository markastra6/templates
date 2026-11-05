#!/usr/bin/env bash
# Run on an ephemeral Linux runner. The browser namespace has no default route.
set -euo pipefail
mode=$1
case "$mode" in lighthouse|pa11y|probe) ;; *) exit 2 ;; esac
: "${TARGET_URL:?}" "${AUDIT_HOST:?}" "${RUNNER_TEMP:?}"
target=$(python scripts/audit_target.py "$TARGET_URL" "$AUDIT_HOST")
read -r host address <<< "$target"
if [[ "$address" == *:* ]]; then address="[$address]"; fi
ns=audit-browser
peer=192.0.2.1
client=192.0.2.2
cleanup() {
  if [[ -n "${relay_pid:-}" ]]; then kill "$relay_pid" 2>/dev/null || true; fi
  sudo ip netns del "$ns" 2>/dev/null || true
  sudo ip link del audit-host 2>/dev/null || true
  sudo rm -f "/etc/netns/$ns/hosts" "/etc/netns/$ns/resolv.conf"
  sudo rmdir "/etc/netns/$ns" 2>/dev/null || true
}
sudo ip netns add "$ns"
trap cleanup EXIT
sudo ip link add audit-host type veth peer name audit-client
sudo ip link set audit-client netns "$ns"
sudo ip addr add "$peer/30" dev audit-host
sudo ip link set audit-host up
sudo ip -n "$ns" addr add "$client/30" dev audit-client
sudo ip -n "$ns" link set audit-client up
sudo ip -n "$ns" link set lo up
sudo mkdir -p "/etc/netns/$ns"
printf '127.0.0.1 localhost\n%s %s\n' "$peer" "$host" | sudo tee "/etc/netns/$ns/hosts" >/dev/null
printf 'nameserver 127.0.0.1\n' | sudo tee "/etc/netns/$ns/resolv.conf" >/dev/null
inside=(sudo ip netns exec "$ns")
"${inside[@]}" iptables -P OUTPUT DROP
"${inside[@]}" ip6tables -P OUTPUT DROP
"${inside[@]}" iptables -A OUTPUT -o lo -j ACCEPT
"${inside[@]}" iptables -t nat -A OUTPUT -p tcp -d "$peer" --dport 443 -j DNAT --to-destination "$peer:8443"
"${inside[@]}" iptables -A OUTPUT -p tcp -d "$peer" --dport 8443 -j ACCEPT
# Forward encrypted bytes to one verified IP. Chrome verifies the original hostname's TLS certificate.
systemd-socket-activate -l "$peer:8443" /lib/systemd/systemd-socket-proxyd "$address:443" &
relay_pid=$!
for _ in {1..30}; do ss -H -lnt | grep -F "$peer:8443" >/dev/null && break; sleep .1; done
kill -0 "$relay_pid"
if "${inside[@]}" ip route get 169.254.169.254 >/dev/null 2>&1; then echo "Unexpected external route"; exit 1; fi
run=("${inside[@]}" sudo -u "$(id -un)" -- env "PATH=$PATH" "HOME=$HOME" "CHROME_PATH=$(command -v google-chrome)" "PUPPETEER_EXECUTABLE_PATH=$(command -v google-chrome)")
bin="$RUNNER_TEMP/audit-tools/node_modules/.bin"
if [[ "$mode" == probe ]]; then
  probe=("${run[@]}" curl --noproxy '*' --max-time 3 --silent --show-error --cacert "$AUDIT_CA")
  "${probe[@]}" --fail "$TARGET_URL"
  if "${probe[@]}" --location "${TARGET_URL}redirect"; then
    echo "Redirect escaped isolation" >&2; exit 1
  fi
  exit 0
fi
if [[ "$mode" == lighthouse ]]; then
  "${run[@]}" "$bin/lighthouse" "$TARGET_URL" --chrome-flags="--headless --disable-dev-shm-usage" \
    --only-categories=performance,accessibility,best-practices,seo --output=html --output=json \
    --output-path=./lighthouse --quiet
  python scripts/check_lighthouse.py lighthouse.report.json
else
  "${run[@]}" "$bin/pa11y-ci" "$TARGET_URL"
fi
