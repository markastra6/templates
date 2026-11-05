"""Tests for the unified toolchain registry and shared UI handoff contract."""

from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from scripts.validate_repo import (
    validate_toolchain_registry_data,
    validate_ui_handoff_template_data,
)


ROOT = Path(__file__).resolve().parents[1]


def load_contract_files() -> tuple[dict, dict]:
    registry = json.loads((ROOT / "docs/contracts/toolchain.registry.json").read_text(encoding="utf-8"))
    handoff = json.loads((ROOT / "docs/contracts/ui-handoff.template.json").read_text(encoding="utf-8"))
    return registry, handoff


class UnifiedToolchainContractTests(unittest.TestCase):
    def test_committed_registry_and_template_are_valid(self) -> None:
        registry, handoff = load_contract_files()
        errors: list[str] = []
        tool_ids = validate_toolchain_registry_data(registry, errors)
        version = validate_ui_handoff_template_data(handoff, tool_ids, errors)
        self.assertEqual(len(tool_ids), 112)
        self.assertEqual(registry["core_tool_count"], 15)
        self.assertEqual(registry["reviewed_candidate_count"], 97)
        self.assertEqual(registry["total_tool_records"], len(tool_ids))
        self.assertEqual(version, "1.0.0")
        self.assertEqual(errors, [])

    def test_every_candidate_has_provenance_activation_and_cost_boundaries(self) -> None:
        registry, _ = load_contract_files()
        candidates = [
            tool for tool in registry["tools"]
            if tool.get("repo_state", "").startswith("reviewed-candidate")
        ]
        self.assertEqual(len(candidates), 97)
        for candidate in candidates:
            with self.subTest(tool=candidate.get("id")):
                self.assertTrue(candidate.get("repo_url", "").startswith("https://github.com/"))
                self.assertTrue(candidate.get("activation"))
                self.assertTrue(candidate.get("selection_rule"))
                self.assertTrue(candidate.get("cost_boundary"))
                self.assertTrue(candidate.get("license_note"))
                self.assertIn(candidate.get("repo_state"), {"reviewed-candidate-not-installed", "reviewed-candidate-not-configured"})

    def test_duplicate_tool_ids_are_rejected(self) -> None:
        registry, _ = load_contract_files()
        registry["tools"].append(copy.deepcopy(registry["tools"][0]))
        errors: list[str] = []
        validate_toolchain_registry_data(registry, errors)
        self.assertTrue(any("duplicate tool id" in error for error in errors))

    def test_unknown_component_source_is_rejected(self) -> None:
        registry, handoff = load_contract_files()
        tool_ids = validate_toolchain_registry_data(registry, [])
        handoff["component_registry"][0]["source_tool_id"] = "tool-does-not-exist"
        errors: list[str] = []
        validate_ui_handoff_template_data(handoff, tool_ids, errors)
        self.assertTrue(any("references unknown tool" in error for error in errors))

    def test_unknown_tool_run_is_rejected(self) -> None:
        registry, handoff = load_contract_files()
        tool_ids = validate_toolchain_registry_data(registry, [])
        handoff["tool_runs"][0]["tool_id"] = "tool-does-not-exist"
        errors: list[str] = []
        validate_ui_handoff_template_data(handoff, tool_ids, errors)
        self.assertTrue(any("tool_runs" in error and "unknown tool" in error for error in errors))

    def test_duplicate_motion_target_is_rejected(self) -> None:
        registry, handoff = load_contract_files()
        tool_ids = validate_toolchain_registry_data(registry, [])
        handoff["motion_ownership"].append(copy.deepcopy(handoff["motion_ownership"][0]))
        handoff["motion_ownership"][1]["owner"] = "gsap"
        errors: list[str] = []
        validate_ui_handoff_template_data(handoff, tool_ids, errors)
        self.assertTrue(any("multiple motion owners" in error for error in errors))

    def test_unknown_motion_owner_is_rejected(self) -> None:
        registry, handoff = load_contract_files()
        tool_ids = validate_toolchain_registry_data(registry, [])
        handoff["motion_ownership"][0]["owner"] = "all-of-them"
        errors: list[str] = []
        validate_ui_handoff_template_data(handoff, tool_ids, errors)
        self.assertTrue(any("unsupported owner" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
