"""Fail an audit when a category falls below its minimum score."""
import json
import sys
from pathlib import Path

MINIMUM = {"performance": 0.75, "accessibility": 0.90, "best-practices": 0.85, "seo": 0.80}


def failed_categories(report):
    if report.get("runtimeError"):
        return ["Lighthouse runtime error"]
    categories = report.get("categories", {})
    return [name for name, minimum in MINIMUM.items()
            if type(categories.get(name, {}).get("score")) not in (float, int)
            or not categories[name]["score"] >= minimum]


if __name__ == "__main__":
    failed = failed_categories(json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")))
    if failed:
        sys.exit("Lighthouse budget failed: " + ", ".join(failed))
