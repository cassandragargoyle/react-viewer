# GitHub Workflow for portunix-vscode

GitHub is the **primary and only** remote for this repository. The former
Gitea→GitHub synchronization directory / upload step has been retired (see
issue 107); there is no longer a separate publishing step.

## Remote Structure

```
origin -> https://github.com/CassandraGargoyle/portunix-vscode (private)
```

The repository is **private**. The submodule `plugins/pdf-viewer` points at its
own GitHub repository.

## Standard Development Flow

```bash
# Create a feature/fix branch
git checkout -b feature/<issue-id>-<short-description>

# Commit and push directly to GitHub
git add .
git commit -m "feat(<issue-id>): <summary>"
git push -u origin feature/<issue-id>-<short-description>

# Open a pull request against main
gh pr create --fill
```

Merge via pull request (or a direct merge for trivial changes), then delete the
feature branch. See the `/finish-branch` skill for the guided flow.

## Clone with Submodules

```bash
git clone https://github.com/CassandraGargoyle/portunix-vscode.git
cd portunix-vscode
git submodule update --init --recursive
```

## Notes

- No content is stripped on publish anymore — the repository lives on GitHub
  as-is. Keep private/scratch files (`CLAUDE.local.md`, `NOTES.md`, `.env*`,
  keys/certs) covered by `.gitignore` so they are never tracked.
- Releases are published as GitHub Releases (see the `/release` skill).
