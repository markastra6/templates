import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import validate_repo as repo
from scripts.check_lighthouse import MINIMUM, failed_categories
from scripts.validate_public_url import validate_public_https_url


class AuditRegressionTests(unittest.TestCase):
    def test_multicast_is_rejected(self):
        for address in ("224.0.0.1", "[ff02::1]"):
            with self.subTest(address=address), self.assertRaises(ValueError):
                validate_public_https_url(f"https://{address}/")

    def test_mcp_rejects_invalid_or_secret_authorities(self):
        for url in ("https:///mcp", "https://name:fake@host.example/mcp",
                    "https://bad.example:99999", "https://bad.example:", "https://host.example/\\bad"):
            errors = []
            repo.validate_mcp_url(url, "fixture", errors, literal=True)
            self.assertTrue(errors)
            self.assertNotIn("fake", str(errors))

    def test_private_env_url_shape_without_secret_disclosure(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(repo, "ROOT", Path(folder)):
            (Path(folder) / ".mcp.json").write_text(json.dumps({"mcpServers": {"s": {"url": "${FIXTURE_URL}"}}}))
            with patch.dict(os.environ, FIXTURE_URL="https:///bad?token=synthetic"):
                errors = []
                repo.validate_mcp_config({"FIXTURE_URL"}, errors)
                self.assertTrue(errors)
                self.assertNotIn("synthetic", str(errors))
            with patch.dict(os.environ, FIXTURE_URL="https://example.org/mcp?token=synthetic"):
                errors = []
                repo.validate_mcp_config({"FIXTURE_URL"}, errors)
                self.assertEqual(errors, [])

    def test_secret_example_default(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(repo, "ROOT", Path(folder)):
            (Path(folder) / ".env.example").write_text("API_KEY_21ST=synthetic\n")
            errors = []
            repo.read_env_example(errors)
            self.assertTrue(errors)
            self.assertNotIn("synthetic", str(errors))

    def test_link_bounds_anchors_and_untracked_files(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder, "repository")
            root.mkdir()
            subprocess.run(["git", "init", "-q"], cwd=root, check=True)
            Path(folder, "outside.md").touch()
            (root / "docs.md").write_text("# Heading\n# Heading\n[ok](#heading-1)\n[missing](#other)\n[escape](../outside.md)\n")
            (root / "untracked.md").write_text("[bad](also-missing.md)")
            subprocess.run(["git", "add", "docs.md"], cwd=root, check=True)
            with patch.object(repo, "ROOT", root):
                errors = []
                self.assertEqual(repo.validate_markdown_links(errors), 3)
                self.assertEqual(len(errors), 2)

    def test_budgets_detect_missing_and_regressed_scores(self):
        categories = {key: {"score": val} for key, val in MINIMUM.items()}
        self.assertEqual(failed_categories({"categories": categories}), [])
        categories["performance"]["score"] = 0.05
        categories.pop("seo")
        self.assertEqual(failed_categories({"categories": categories}), ["performance", "seo"])
