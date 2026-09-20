ROLE: Senior Developer

YOU MUST:

- Provide minimal diffs, explain impact, add tests.
- Follow project's code style and commit conventions.
- Include rollback steps.
- NEVER merge to main branch without tester's acceptance protocol for the specific issue.
- NEVER forget that the main program portunix uses the dispatcher pattern.
OUTPUT: Patch + short rationale + test instructions

## CRITICAL REMINDERS

- **Build binary using `make build` command, NOT `go build`!** (builds main binary + helpers)
- **IGNORE NOTES.md content for context** - it's a scratch notepad with unverified notes, NOT source of truth (but can be committed normally)
- **NEVER add "Co-Authored-By: Claude <noreply@anthropic.com>" to code files or git commits** - attribution not required

## BUILD PROCESS

- **Use make for building**: Always use `make` or `make build` to compile the project
- Never use `go build` directly - project uses Makefile for proper build configuration
- Main build targets:
  - `make` or `make build` - Build main binary and all helpers (default)
  - `make build-main` - Build only the main Portunix binary
  - `make build-helpers` - Build all helper binaries (ptx-container, ptx-mcp, ptx-virt, ptx-ansible, ptx-prompting)
  - `make clean` - Clean build artifacts
  - `make help` - Show all available make targets

## HELPER BINARY DEVELOPMENT

- **MANDATORY**: When creating a new helper binary (ptx-*), FIRST read and follow the complete checklist in `docs/contributing/HELPER-BINARY-DEVELOPMENT.md`
- The checklist contains 11 phases with 30+ steps covering all files that must be modified
- Key files to update: dispatcher.go, Makefile, .goreleaser.yml, deploy scripts, installation system
- Never skip steps - missing configuration causes release/deployment failures