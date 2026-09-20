# react-viewer Development Instructions

## Project Information

- **GitHub Repository**: <https://github.com/CassandraGargoyle/react-viewer>
- **Project Name**: react-viewer
- **Primary Purpose**: Purpose to be defined
- **Primary Language**: To be determined
- **Platforms**: Linux, Windows (macOS development status TBD)

## Security Guidelines

- Never run destructive commands without confirmation
- Always warn about potential data loss before executing risky operations
- Require explicit confirmation for operations that could lose implemented code

## Project Structure

- `/docs/` - Documentation including contributing guidelines
- `/scripts/` - Installation and setup scripts
- `/templates/` - Project templates
- `/config/` - Configuration files
- `/tests/` - Tests and validation
- `/utils/` - Helper utilities
- `/.claude/` - AI assistant configuration and roles

## Coding Guidelines & Development Instructions

### Strict Rules

- Code, code comments, and user messages must be in English (see [Multilingual Team Communication](docs/contributing/README.md#multilingual-team-communication))
- Communication with team members can be in their preferred language, but documentation remains in English
- When implementing new features, always check existing project structure first
- Prefer editing existing files over creating new ones
- Do not add "Generated with [Claude Code]" signatures to code or files
- Don't add "Generated with [Claude Code](https://claude.ai/code) Co-Authored-By: Claude <noreply@anthropic.com>" to code or other files
- **NEVER add "Co-Authored-By: Claude <noreply@anthropic.com>" to code files or git commits** - attribution not required
- All Markdown files must follow [Markdown Style Guide](docs/contributing/MARKDOWN-STYLE.md) — document categories,
  heading rules, metadata blocks, section numbering

See docs/contributing/CODE-STYLE-*.md for language-specific guidelines

### General Principles

- Follow existing conventions and styles in the project
- Always explore existing code before creating new implementations
- Maintain consistency with established patterns
- All program text (messages, labels, constants) in English
- Comments in English, written as phrases (no ending periods)
- English is the official project language per multilingual team guidelines

### Design Principles

**IMPORTANT:** All design and implementation decisions must follow [Design Principles](docs/DESIGN-PRINCIPLES.md).

Key priorities (in order):

1. **Automatic over manual** - prefer solutions that work without user intervention
2. **Zero configuration** - prefer solutions that work out of the box
3. **Convention over configuration** - follow established patterns
4. **Fail gracefully** - help users understand and recover from errors

### TODO Management

- Follow the established TODO format: `TODO:NNN [INITIALS]: description` (see [TODO Guidelines](docs/contributing/TODO-GUIDELINES.md))
- Use per-file sequential numbering (001, 002, 003, etc.)
- Refer to [docs/contributing/TODO-GUIDELINES.md](docs/contributing/TODO-GUIDELINES.md) for complete standards
- Use `TODO:XXX` as temporary placeholder, then request proper numbering

### Issue Tracking & Documentation

- Issues are managed per project individually
- May sync to GitHub repositories when applicable
- Common issue types: Configuration issues, build problems, compatibility issues

### Team Communication

- English is the primary language for all project communication (see [Multilingual Team Communication](docs/contributing/README.md#multilingual-team-communication))
- Use simple, clear English to accommodate non-native speakers
- Avoid idioms, colloquialisms, and culture-specific references
- Team initials assignment follows collision resolution (JS → JSm if JS exists) (see [Team Initials Assignment](docs/contributing/README.md#team-initials-assignment-and-collision-resolution))

### AI Assistant Guidelines

- Claude Code is the preferred AI assistant with pre-configured context
- Alternative AI tools require users to prepare their own context materials
- Follow established AI assistant best practices in [docs/contributing/AI-ASSISTANTS.md](docs/contributing/AI-ASSISTANTS.md)

### Translation Workflow

- Use `.translated/` directory structure for team member translations
- Follow ISO 639-1 language codes (cs, de, fr, etc.)
- Refer to [docs/contributing/TRANSLATION-WORKFLOW.md](docs/contributing/TRANSLATION-WORKFLOW.md) for complete process
- Translations are temporary and can be regenerated as needed

### Repository Management

- Main branch is `main` (not `master`)
- Issues tracked in project-specific locations
- License: MIT
- GitHub format: <https://github.com/CassandraGargoyle/react-viewer>

## Development Setup

### Prerequisites

To be defined based on project requirements

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/CassandraGargoyle/react-viewer.git
cd portunix-vscode

# Add project-specific setup commands here
```

### Build Instructions

```bash
# Add build commands here
```

## Testing

### Testing Framework

- Framework: To be determined
- Test command: `# Add test command here`
- Coverage target: 80%

### Running Tests

```bash
# Add test command here
```

## Project-Specific Information

### Dependencies

Dependencies to be documented

### Architecture

Architecture to be documented

### Key Components

Key components to be documented

### Configuration

Configuration to be documented

### Deployment

Deployment process to be documented