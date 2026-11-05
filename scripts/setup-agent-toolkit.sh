#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
case "${1:-}" in
  motion|gsap|taste|vercel|21st|uipro|shadcn|all) selection=$1 ;;
  *) echo "Usage: bash scripts/setup-agent-toolkit.sh {motion|gsap|taste|vercel|21st|uipro|shadcn|all}"; exit 2 ;;
esac

npm ci --prefix tools/agent --ignore-scripts --no-audit --no-fund
bin="$PWD/tools/agent/node_modules/.bin"
temp=$(mktemp -d)
trap 'rm -rf -- "$temp"' EXIT
install_skill() {
  local repo=$1 commit=$2 folder="$temp/${1##*/}"
  shift 2
  git init -q "$folder"
  git -C "$folder" fetch --depth=1 "https://github.com/$repo.git" "$commit"
  git -C "$folder" checkout -q --detach "$commit"
  test "$(git -C "$folder" rev-parse HEAD)" = "$commit"
  "$bin/skills" add "$folder" --copy "$@"
}
selected() { [[ "$selection" == all || "$selection" == "$1" ]]; }
if selected motion; then "$bin/skills" add "$PWD/tools/agent/node_modules/motion-ai/content/skills" --copy; fi
if selected gsap; then install_skill greensock/gsap-skills aed9cfd3277740755f6bfc1155c7aa645403b760; fi
if selected taste; then install_skill Leonxlnx/taste-skill 9b4bf937a1f69348126959c15d2f99a73e65699b --skill design-taste-frontend; fi
if selected vercel; then install_skill vercel-labs/agent-skills 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62 --skill react-best-practices --skill web-design-guidelines; fi
if selected 21st; then install_skill 21st-dev/skill 15c7436c41dc88c54094f1be93ce53bda456b114; fi
if selected uipro; then "$bin/uipro" init --ai universal --offline; fi
