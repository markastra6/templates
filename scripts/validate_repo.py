#!/usr/bin/env python3
"""Offline validation for repository-owned agent and MCP configuration."""

from __future__ import annotations

import json
import os
import re
import sys
import subprocess
from pathlib import Path
from urllib.parse import parse_qsl, unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
PLACEHOLDER = re.compile(r"\$\{([A-Z][A-Z0-9_]*)\}")
MARKDOWN_LINK = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")
SECRET_QUERY_KEYS = {"token", "usertoken", "api_key", "apikey", "access_token"}


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def read_env_example(errors: list[str]) -> set[str]:
    path = ROOT / ".env.example"
    if not path.is_file():
        fail(".env.example is missing", errors)
        return set()

    names: set[str] = set()
    for line_number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            fail(f".env.example:{line_number}: expected KEY=value", errors)
            continue
        name, value = line.split("=", 1)
        safe_defaults = {"STRIX_LLM": "ollama/qwen3-vl", "LLM_API_BASE": "http://localhost:11434"}
        if value and value != safe_defaults.get(name):
            fail(f".env.example:{line_number}: leave credentials blank and use only documented local defaults", errors)
        if not re.fullmatch(r"[A-Z][A-Z0-9_]*", name):
            fail(f".env.example:{line_number}: invalid environment key {name!r}", errors)
            continue
        if name in names:
            fail(f".env.example:{line_number}: duplicate environment key {name}", errors)
        names.add(name)
    return names


def validate_mcp_url(raw: str, name: str, errors: list[str], *, literal: bool) -> None:
    try:
        parsed = urlsplit(raw)
        port = parsed.port
        host = parsed.hostname
        invalid = (
            not host or parsed.username is not None or parsed.password is not None
            or port == 0 or parsed.netloc.endswith(":") or "\\" in raw
            or any(ord(c) <= 32 or ord(c) == 127 for c in raw)
            or (parsed.scheme != "https" and not (
                parsed.scheme == "http" and host in {"localhost", "127.0.0.1", "::1"}
            ))
            or (literal and any(k.casefold() in SECRET_QUERY_KEYS for k, _ in parse_qsl(parsed.query)))
        )
    except ValueError:
        invalid = True
    if invalid:
        fail(f".mcp.json: {name!r} has an invalid endpoint or embedded credentials", errors)


def validate_mcp_config(env_names: set[str], errors: list[str]) -> None:
    path = ROOT / ".mcp.json"
    try:
        config = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        fail(f".mcp.json cannot be parsed: {exc}", errors)
        return

    servers = config.get("mcpServers") if isinstance(config, dict) else None
    if not isinstance(servers, dict) or not servers:
        fail(".mcp.json must contain a non-empty mcpServers object", errors)
        return

    for name, spec in servers.items():
        if not isinstance(name, str) or not name.strip() or not isinstance(spec, dict):
            fail(f".mcp.json: invalid server entry {name!r}", errors)
            continue

        has_command = isinstance(spec.get("command"), str) and bool(spec["command"].strip())
        has_url = isinstance(spec.get("url"), str) and bool(spec["url"].strip())
        if has_command == has_url:
            fail(f".mcp.json: server {name!r} must define exactly one of command or url", errors)
        if has_command and not isinstance(spec.get("args", []), list):
            fail(f".mcp.json: server {name!r} args must be an array", errors)
        if has_url:
            raw_url = spec["url"]
            variable = PLACEHOLDER.fullmatch(raw_url)
            if variable and (resolved := os.environ.get(variable.group(1))):
                validate_mcp_url(resolved, name, errors, literal=False)
            if not variable:
                validate_mcp_url(raw_url, name, errors, literal=True)

        serialized = json.dumps(spec, ensure_ascii=False)
        for variable in PLACEHOLDER.findall(serialized):
            if variable not in env_names:
                fail(f".mcp.json: {name!r} references {variable}, missing from .env.example", errors)


def validate_env_gitignore(errors: list[str]) -> None:
    ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
    if ".env" not in ignore or ".env.*" not in ignore:
        fail(".gitignore must exclude .env and .env.* files", errors)
    if "!.env.example" not in ignore:
        fail(".gitignore must explicitly keep the safe .env.example template", errors)


def markdown_anchors(text: str) -> set[str]:
    anchors = set()
    text = re.sub(r"`{3}[\s\S]*?`{3}|~~~[\s\S]*?~~~", "", text)
    for heading in re.findall(r"^ {0,3}#{1,6} (.+)$", text, flags=re.MULTILINE):
        base = re.sub(r"[^\w\- ]", "", heading.lower().strip()).replace(" ", "-")
        anchor = base
        suffix = 0
        while anchor in anchors:
            suffix += 1
            anchor = f"{base}-{suffix}"
        anchors.add(anchor)
    return anchors


def validate_markdown_links(errors: list[str]) -> int:
    count = 0
    tracked = set(subprocess.check_output(
        ["git", "ls-files", "-z"], cwd=ROOT
    ).decode("utf-8").rstrip("\0").split("\0"))
    directories = {parent.as_posix() for path in tracked for parent in Path(path).parents}
    valid_paths = tracked | directories
    for filename in sorted(tracked):
        if not filename.endswith(".md"):
            continue
        markdown = ROOT / filename
        text = markdown.read_text(encoding="utf-8")
        text = re.sub(r"\x60{3}[\s\S]*?\x60{3}|~~~[\s\S]*?~~~", "", text)
        for match in MARKDOWN_LINK.finditer(text):
            target = match.group(1).strip().split(maxsplit=1)[0].strip("<>")
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc:
                continue
            local = (markdown.parent / unquote(parsed.path)).resolve() if parsed.path else markdown
            count += 1
            relative = local.relative_to(ROOT).as_posix() if local.is_relative_to(ROOT) else None
            if relative not in valid_paths or not local.exists():
                fail(
                    f"{markdown.relative_to(ROOT).as_posix()}: broken local link {target!r}",
                    errors,
                )
            elif parsed.fragment and local.suffix == ".md":
                headings = markdown_anchors(local.read_text(encoding="utf-8"))
                if unquote(parsed.fragment) not in headings:
                    fail(f"{filename}: missing heading in {target!r}", errors)
    return count



def validate_toolchain_registry_data(data: object, errors: list[str]) -> set[str]:
    """Validate the shared registry that defines tool roles and handoffs."""
    if not isinstance(data, dict):
        fail("toolchain registry must be a JSON object", errors)
        return set()
    if not isinstance(data.get("schema_version"), str) or not data["schema_version"]:
        fail("toolchain registry must define schema_version", errors)

    tools = data.get("tools")
    if not isinstance(tools, list) or not tools:
        fail("toolchain registry must contain a non-empty tools array", errors)
        return set()

    ids: set[str] = set()
    required_strings = ("id", "name", "organ", "kind", "repo_state", "client_state", "responsibility")
    for index, tool in enumerate(tools):
        if not isinstance(tool, dict):
            fail(f"toolchain registry tools[{index}] must be an object", errors)
            continue
        for key in required_strings:
            if not isinstance(tool.get(key), str) or not tool[key].strip():
                fail(f"toolchain registry tools[{index}] must define non-empty {key}", errors)
        tool_id = tool.get("id")
        if isinstance(tool_id, str) and tool_id:
            if tool_id in ids:
                fail(f"toolchain registry contains duplicate tool id {tool_id!r}", errors)
            ids.add(tool_id)
        for key in ("consumes", "produces", "handoff_to"):
            values = tool.get(key)
            if not isinstance(values, list) or any(not isinstance(value, str) or not value for value in values):
                fail(f"toolchain registry tools[{index}].{key} must be an array of non-empty strings", errors)
        if isinstance(tool.get("repo_state"), str) and tool["repo_state"].startswith("reviewed-candidate"):
            for key in ("repo_url", "activation", "selection_rule", "cost_boundary", "license_note"):
                if not isinstance(tool.get(key), str) or not tool[key].strip():
                    fail(f"toolchain registry candidate tools[{index}] must define non-empty {key}", errors)
            repo_url = tool.get("repo_url", "")
            if not isinstance(repo_url, str) or not repo_url.startswith("https://github.com/"):
                fail(f"toolchain registry candidate tools[{index}] repo_url must use an HTTPS GitHub repository URL", errors)
    declared_counts = {
        "core_tool_count": sum(
            1 for tool in tools
            if isinstance(tool, dict) and not str(tool.get("repo_state", "")).startswith("reviewed-candidate")
        ),
        "reviewed_candidate_count": sum(
            1 for tool in tools
            if isinstance(tool, dict) and str(tool.get("repo_state", "")).startswith("reviewed-candidate")
        ),
        "total_tool_records": len(tools),
    }
    for key, actual in declared_counts.items():
        if key in data and data[key] != actual:
            fail(f"toolchain registry {key} says {data[key]!r}, actual value is {actual}", errors)
    return ids


def validate_ui_handoff_template_data(data: object, tool_ids: set[str], errors: list[str]) -> str | None:
    """Validate the feature handoff contract and enforce one motion owner per target."""
    if not isinstance(data, dict):
        fail("UI handoff template must be a JSON object", errors)
        return None

    required_sections = (
        "contract_version", "contract_status", "feature", "source_of_truth",
        "design_system", "component_registry", "interactions", "motion_ownership",
        "data_contracts", "tool_runs", "quality_gates", "decisions", "defects", "handoff",
    )
    for section in required_sections:
        if section not in data:
            fail(f"UI handoff template is missing {section}", errors)

    version = data.get("contract_version")
    if not isinstance(version, str) or not version:
        fail("UI handoff template must define contract_version", errors)
        version = None

    source = data.get("source_of_truth")
    if not isinstance(source, dict) or source.get("design_source") not in {"undecided", "penpot", "figma", "lunacy", "exported-reference"}:
        fail("UI handoff source_of_truth.design_source must select one supported source or remain undecided", errors)

    design_system = data.get("design_system")
    if not isinstance(design_system, dict) or not isinstance(design_system.get("tokens"), dict):
        fail("UI handoff design_system must contain a tokens object", errors)
    else:
        for token_group in ("color", "typography", "spacing", "radii", "elevation", "breakpoints", "motion"):
            if token_group not in design_system["tokens"]:
                fail(f"UI handoff design tokens are missing {token_group}", errors)

    allowed_motion_owners = {"css", "motion", "gsap", "none"}
    ownership = data.get("motion_ownership")
    if not isinstance(ownership, list):
        fail("UI handoff motion_ownership must be an array", errors)
    else:
        targets: set[str] = set()
        for index, entry in enumerate(ownership):
            if not isinstance(entry, dict):
                fail(f"UI handoff motion_ownership[{index}] must be an object", errors)
                continue
            target = entry.get("target")
            owner = entry.get("owner")
            if not isinstance(target, str) or not target:
                fail(f"UI handoff motion_ownership[{index}] must define a target", errors)
            elif target in targets:
                fail(f"UI handoff has multiple motion owners for target {target!r}", errors)
            else:
                targets.add(target)
            if owner not in allowed_motion_owners:
                fail(f"UI handoff motion_ownership[{index}] has unsupported owner {owner!r}", errors)

    components = data.get("component_registry")
    if not isinstance(components, list):
        fail("UI handoff component_registry must be an array", errors)
    else:
        for index, entry in enumerate(components):
            if not isinstance(entry, dict):
                fail(f"UI handoff component_registry[{index}] must be an object", errors)
                continue
            source_tool = entry.get("source_tool_id")
            if source_tool not in tool_ids:
                fail(f"UI handoff component_registry[{index}] references unknown tool {source_tool!r}", errors)

    tool_runs = data.get("tool_runs")
    if not isinstance(tool_runs, list):
        fail("UI handoff tool_runs must be an array", errors)
    else:
        for index, entry in enumerate(tool_runs):
            if not isinstance(entry, dict) or entry.get("tool_id") not in tool_ids:
                tool_id = entry.get("tool_id") if isinstance(entry, dict) else None
                fail(f"UI handoff tool_runs[{index}] references unknown tool {tool_id!r}", errors)

    for section in ("decisions", "defects", "interactions", "data_contracts"):
        if section in data and not isinstance(data[section], list):
            fail(f"UI handoff {section} must be an array", errors)

    return version


def validate_unified_toolchain(errors: list[str]) -> tuple[int, str | None]:
    """Load and validate the tool registry and shared feature contract template."""
    registry_path = ROOT / "docs" / "contracts" / "toolchain.registry.json"
    contract_path = ROOT / "docs" / "contracts" / "ui-handoff.template.json"
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        fail(f"toolchain registry cannot be parsed: {exc}", errors)
        return 0, None
    tool_ids = validate_toolchain_registry_data(registry, errors)
    try:
        contract = json.loads(contract_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        fail(f"UI handoff template cannot be parsed: {exc}", errors)
        return len(tool_ids), None
    version = validate_ui_handoff_template_data(contract, tool_ids, errors)
    return len(tool_ids), version

def main() -> int:
    errors: list[str] = []
    env_names = read_env_example(errors)
    validate_mcp_config(env_names, errors)
    validate_env_gitignore(errors)
    local_links = validate_markdown_links(errors)
    tool_count, contract_version = validate_unified_toolchain(errors)

    if errors:
        print("Repository validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        json.dumps(
            {
                "status": "passed",
                "mcp_servers": len(
                    json.loads((ROOT / ".mcp.json").read_text(encoding="utf-8"))["mcpServers"]
                ),
                "environment_keys": len(env_names),
                "toolchain_tools": tool_count,
                "ui_handoff_contract_version": contract_version,
                "local_markdown_links_checked": local_links,
                "checks": [
                    "MCP JSON structure and transport",
                    "MCP environment variable declarations",
                    "secret-safe environment template and Git ignore rules",
                    "local Markdown link integrity",
                    "tool registry and handoff structure",
                    "single motion owner per animated target",
                ],
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
