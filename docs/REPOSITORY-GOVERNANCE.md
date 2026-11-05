# Repository governance

This document defines the recommended controls for the default branch. It is a configuration checklist, not evidence that GitHub is enforcing the controls.

## Current enforcement state

As verified on 2026-11-02, the `main` branch had no branch-protection rule or ruleset enabled. CI checks run, but GitHub does not yet prevent a direct push, force push, or deletion of `main`.

## Recommended `main` ruleset

Create a branch ruleset in **Settings → Rules → Rulesets** and target the `main` branch.

Enable:

1. **Require a pull request before merging.** Keep the required approval count at zero while this is a single-maintainer project; the maintainer can still inspect the diff and merge their own pull request.
2. **Require status checks to pass before merging.** Select the checks that run on every pull request:
   - `validate` (Repository validation)
   - `Markdown lint`
   - `Node.js checks and dependency audit`
   - `Scan repository history for secrets`
   - `Detect supported source` (CodeQL workflow)
   - `Detect Playwright setup` (Browser tests workflow)
3. **Block force pushes.**
4. **Block branch deletion.**

The starter now runs Chromium browser tests and both Python and JavaScript/TypeScript analysis. Require the actual analysis and browser job names after they have run on the repository.

## Operating rules

- Use a short-lived branch for changes and open a pull request to `main`.
- Review the complete diff, changed-file list, permissions, and third-party action updates before merging.
- Do not merge when a required check fails, is missing, or has not completed.
- Keep bypass actors empty or limited to a documented emergency path.
- Revisit required checks whenever workflow job names change.
- Reassess the ruleset after selecting the framework, package manager, and deployment model.

## Manual verification

After configuring the ruleset, open **Settings → Rules → Rulesets**, confirm it is active and targets `main`, then open a test pull request and verify that GitHub blocks merging until required checks pass. Do not treat this document or a green Actions run as proof that branch protection is active.
