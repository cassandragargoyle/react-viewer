# Issue Management for portunix-vscode

## Overview

This document outlines how issues are managed in the portunix-vscode project.
Active issues live in `docs/issues/`; completed (done) issues are
archived in `docs/issues/done/`. The **issue index and status live on
GitHub Issues** — the directory `README.md` files are minimal stubs and carry no
per-issue table (a hand-maintained list conflicts constantly and duplicates what
GitHub already provides).

### Dual system: files + GitHub Issues

Issues live in **two places that stay 1:1 aligned**:

- **Markdown files** (`NNN-slug.md`) — the **canonical content**. Full
  description, acceptance criteria, audit notes. The agent reads and writes
  issues here; they are versioned with the code and work offline.
- **GitHub Issues** — the **number authority** and the mirror. Each GitHub issue
  `#N` matches exactly one file `NNN` (`#42` ⇄ `042-*.md`). GitHub provides
  numbering, `Fixes #N` PR linking, notifications, and external visibility.

**The number is owned by GitHub.** A new issue's number is whatever GitHub
assigns on creation; the file adopts that number.

Two authoring paths feed the system (see
[GitHub Issue Mirror & Numbering](#github-issue-mirror--numbering)):

- **Team member** (developer / tester / architect working in the repo) writes the
  full issue as the `NNN-*.md` file and keeps the GitHub issue body as a
  **summary + link**.
- **User** files the **complete issue on GitHub**; a maintainer then triages it
  into a canonical `NNN-*.md` file (the file becomes the source of truth going
  forward).

## Directory Structure

```text
docs/issues/
├── README.md              # Minimal stub → points to GitHub Issues
├── NNN-*.md               # Active issues (Open / In Progress / On Hold)
└── done/                  # Archived completed issues
    ├── README.md          # Minimal stub → points to GitHub Issues
    └── NNN-*.md           # Implemented / Closed / Resolved issues
```

The former `internal/` vs `external/` split is retired: all issues (bugs,
features, tasks — team-authored or user-reported) are tracked the same way.

- **Active**: All issues live as `NNN-*.md` files directly in `docs/issues/`; the
  index/status is on GitHub Issues
- **Done**: Once an issue reaches a terminal status the file is moved into
  `docs/issues/done/` and its GitHub issue is closed
- **Next number**: **GitHub assigns it.** Create the GitHub issue first; its
  number `#N` becomes the file's `NNN` (zero-padded to 3). GitHub numbers
  monotonically and never reuses, so files and GitHub stay aligned automatically.
  Do **not** hand-pick a number by scanning the directories. (Offline fallback in
  [GitHub Issue Mirror & Numbering](#github-issue-mirror--numbering).)

## GitHub Issue Mirror & Numbering

GitHub Issues (`cassandragargoyle/portunix-vscode`) and the markdown files form
one system. **GitHub owns the number; the file owns the content.**

### Creating a new issue

Both paths end in the same state: a canonical `NNN-*.md` file plus a GitHub issue
`#N` whose body is a summary + link.

#### Path A — team member (developer / tester / architect)

1. **Create the GitHub issue first** to obtain the number:

   ```bash
   gh issue create --repo cassandragargoyle/portunix-vscode \
     --title "NNN: <title>" --body "<summary + link, see below>"
   ```

   GitHub returns `#N`. Use that `N` as the file number `NNN` (zero-padded).

2. **Create the canonical file** `docs/issues/NNN-slug.md` with the
   full description (this is where all real content lives).

3. **Set the GitHub issue body** to a summary plus a link to the file — not the
   full content:

   ```markdown
   **Type:** <type> · **Priority:** <priority> · **Status:** <status>

   <one- or two-sentence summary>

   📄 Full issue: [`docs/issues/NNN-slug.md`](https://github.com/cassandragargoyle/portunix-vscode/blob/main/docs/issues/NNN-slug.md)
   ```

#### Path B — user report

A user files the **complete issue directly on GitHub** (full description in the
issue body — they do not touch the repo). A maintainer then:

1. Triages the report; if accepted, note its number `#N`.
2. Creates the canonical file `docs/issues/NNN-slug.md` from the report
   (`NNN` = `#N`), which becomes the source of truth going forward.
3. Reduces the GitHub issue body to the summary + link (Path A step 3), preserving
   the original report in the issue's first comment or edit history. User comments
   and discussion stay on GitHub.

The title should read `NNN: <title>` so the file number is visible in GitHub even
though GitHub also shows `#N` (they are equal by construction).

### Closing / archiving

When an issue reaches a terminal status, in addition to the file move in
[Archiving Completed Issues](#archiving-completed-issues):

1. Close the GitHub issue: `gh issue close N --repo cassandragargoyle/portunix-vscode --reason completed` (use `--reason "not planned"` for ❌ Closed / won't-fix).
2. Update the link in the GitHub issue body to the new `done/` path, since the
   file moved (`.../blob/main/docs/issues/done/NNN-slug.md`).

### One-time backfill of existing issues

Existing files `001`–`NNN` predate GitHub Issues. Because GitHub numbers
sequentially from `#1` and the number **cannot** be chosen, backfill must walk
`1 → highest` with **no skips**:

- For each existing file (active and `done/`), create the matching GitHub issue
  (summary + link). Active → leave **open**; done → create then **close**.
- **Gaps** (numbers with no file) must still consume their `#N` — create a
  **placeholder** issue titled e.g. `NNN: (reserved — no issue)` and close it, so
  every subsequent number stays aligned.

### Offline / GitHub-unavailable fallback

If `gh` is unreachable when an issue must be created, allocate `NNN` temporarily
by the legacy rule (one greater than the highest number anywhere under
`docs/issues/`, **including** `docs/issues/done/`), mark the file
`**GitHub:** pending`, and create the GitHub issue — reconciling the number — as
soon as GitHub is reachable. This is an exception, not the norm.

## Issue Types

### Bug Reports

- Software defects and errors
- Performance issues
- Security vulnerabilities
- Regression bugs

### Feature Requests

- New functionality proposals
- Enhancement suggestions
- API improvements
- User experience improvements

### Tasks

- Development tasks
- Documentation updates
- Maintenance work
- Infrastructure changes

## Labels and Categories

### Type Labels

- `bug` - Bug reports
- `enhancement` - Feature requests
- `task` - General tasks
- `documentation` - Documentation issues
- `question` - Questions and discussions

### Priority Labels

- `critical` - Urgent fixes needed
- `high` - High priority
- `medium` - Normal priority
- `low` - Low priority, nice to have

### Status Labels

- `needs-triage` - Requires initial review
- `in-progress` - Currently being worked on
- `blocked` - Cannot proceed due to dependencies
- `ready-for-review` - Ready for code review
- `needs-info` - More information required

## Workflow

### 1. Issue Creation

- Create the GitHub issue first to get the number, then the file — see
  [GitHub Issue Mirror & Numbering](#github-issue-mirror--numbering)
- Use appropriate template
- Add relevant labels
- Assign to milestone if applicable
- Provide clear description

### 2. Triage Process

- Review new issues weekly
- Assign priority and labels
- Add to appropriate project board
- Assign team members if needed

### 3. Development

- Link pull requests to issues
- Update issue status regularly
- Communicate blockers promptly
- Document decisions and changes

### 4. Closure

- Verify fix or implementation
- Update documentation if needed
- Close with appropriate comment
- Reference in release notes
- **Archive the issue** (see [Archiving Completed Issues](#archiving-completed-issues))

## Archiving Completed Issues

When an issue reaches a terminal status (✅ Implemented, ✅ Resolved, or
❌ Closed):

1. Move the file into the archive:

   ```bash
   git mv docs/issues/NNN-name.md docs/issues/done/NNN-name.md
   ```

2. Set the file's status header to the terminal status (✅ Implemented /
   ✅ Resolved / ❌ Closed) and add the closing date if the file has that field

3. Close the matching GitHub issue and fix its file link — see
   [Closing / archiving](#closing--archiving)

There are no index tables or statistics to update — the index lives on GitHub
Issues.

### Terminal Statuses

| Status         | Meaning                                                  | Archived |
| -------------- | -------------------------------------------------------- | -------- |
| ✅ Implemented | Feature delivered or bug fixed                            | Yes      |
| ✅ Resolved    | Issue addressed (used for support/operational issues)     | Yes      |
| ❌ Closed      | Won't fix / superseded / duplicate / not reproducible     | Yes      |
| 📋 Open        | Awaiting work                                             | No       |
| 🔄 In Progress | Actively being worked on                                  | No       |
| ⏸️ On Hold     | Temporarily paused                                        | No       |

## Templates

### Bug Report Template

```markdown
**Bug Description**
Brief description of the issue

**Environment**

- OS: [e.g. Ubuntu 20.04]
- Version: [e.g. v1.2.3]
- Browser: [if applicable]

**Steps to Reproduce**

1. Step one
2. Step two
3. ...

**Expected Behavior**

What should happen

**Actual Behavior**
What actually happens

**Additional Context**
Any other relevant information
```

### Feature Request Template

```markdown
**Feature Description**
Clear description of the requested feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Screenshots, mockups, or examples
```

## Best Practices

### For Contributors

- Search existing issues before creating new ones
- Provide complete information
- Follow issue templates
- Be respectful and constructive
- Update issues with progress

### For Maintainers

- Respond to issues promptly
- Provide clear feedback
- Use consistent labeling
- Keep issues organized
- Close stale issues appropriately

---

*Effective issue management helps maintain project quality and team productivity.*