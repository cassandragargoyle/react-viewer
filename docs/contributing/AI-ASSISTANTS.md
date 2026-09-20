# AI Assistant Guidelines for portunix-vscode

## Overview

This document provides guidelines for effectively using AI assistants in the portunix-vscode development process.

## Supported AI Assistants

### Claude (Recommended)

- **Claude Code**: Preferred for development tasks with pre-configured context
- **Claude Web**: Alternative for general queries and documentation
- **Setup**: Use CLAUDE.md file for project context

### GitHub Copilot

- **IDE Integration**: Available in VS Code, IntelliJ, etc.
- **Best for**: Code completion and inline suggestions
- **Configuration**: Configure in `.github/copilot` directory

### Alternative Assistants

- **ChatGPT**: General purpose queries
- **Gemini**: Code review and documentation
- **Local LLMs**: For sensitive code (Ollama, LM Studio)

## Best Practices

### 1. Context Preparation

```markdown
# CLAUDE.md Template
Project: portunix-vscode
Language: [Primary languages]
Framework: [Main frameworks]
Key Requirements:
- [Requirement 1]
- [Requirement 2]
```

### 2. Effective Prompting

- Be specific and provide context
- Include relevant code snippets
- Specify language and framework versions
- Define expected output format

### 3. Code Generation Guidelines

- Always review generated code
- Test thoroughly before committing
- Maintain project coding standards
- Document AI-assisted changes

## Use Cases

### Development Tasks

- **Code Generation**: New features and modules
- **Refactoring**: Improving existing code
- **Bug Fixing**: Identifying and resolving issues
- **Testing**: Writing unit and integration tests
- **Documentation**: Creating and updating docs

### Code Review

```markdown
# AI Review Prompt Template
Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Code style violations
4. Potential bugs
5. Improvement suggestions

[Code snippet]
```

### Documentation

- API documentation generation
- README files and guides
- Code comments and docstrings
- Architecture documentation

## Security Considerations

### Sensitive Information

- **Never share**: Passwords, API keys, tokens
- **Sanitize**: Database connections, URLs
- **Review**: Generated code for security issues

### Private Code

- Use local LLMs for proprietary code
- Configure `.gitignore` for AI config files
- Review AI suggestions for data leaks

## Integration Workflow

### 1. Development Cycle

```bash
# 1. Prepare context
cat CLAUDE.md

# 2. Generate code with AI
# [AI interaction]

# 3. Review and test
npm test  # or appropriate test command

# 4. Commit with clear message
git commit -m "feat: add feature X (AI-assisted)"
```

### 2. Pull Request Process

- Mark AI-generated code in PR description
- Include prompts used for transparency
- Ensure human review of all AI code

## Tool-Specific Guidelines

### Claude Code

```bash
# Initialize project context
claude-code init

# Use with specific task
claude-code "implement user authentication"
```

### VS Code + Copilot

```json
// .vscode/settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  }
}
```

### Custom Scripts

```bash
#!/bin/bash
# scripts/ai-review.sh
echo "Preparing code for AI review..."
find . -name "*.{{EXTENSION}}" -type f | xargs cat > review.txt
echo "Code prepared in review.txt"
```

## Quality Assurance

### Code Review Checklist

- [ ] Code follows project style guide
- [ ] No sensitive information exposed
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Testing AI-Generated Code

```bash
# Run comprehensive tests
npm run test:unit
npm run test:integration
npm run test:e2e
npm run lint
npm run security-check
```

## Common Pitfalls

### Avoid

- Blindly accepting suggestions
- Sharing production credentials
- Ignoring project conventions
- Skipping tests for AI code
- Over-relying on AI without understanding

### Solutions

- Always review and understand code
- Use environment variables for secrets
- Configure AI tools with project rules
- Maintain high test coverage
- Balance AI assistance with learning

## Templates and Prompts

### Feature Implementation

```text
Create a {{LANGUAGE}} function that:
- Purpose: [description]
- Input: [parameters]
- Output: [return value]
- Error handling: [requirements]
- Follow portunix-vscode coding standards
```

### Bug Fix

```text
Debug this issue:
- Error message: [error]
- Context: [when it occurs]
- Current code: [snippet]
- Expected behavior: [description]
```

### Documentation Common Pitfalls

```text
Generate documentation for:
- Component: [name]
- Purpose: [description]
- API: [endpoints/methods]
- Examples: [usage examples]
- Format: [Markdown/JSDoc/etc]
```

## Continuous Improvement

### Feedback Loop

1. Track AI suggestion accuracy
2. Document successful patterns
3. Share prompts that work well
4. Update guidelines based on experience

### Team Knowledge Sharing

- Maintain prompt library
- Share AI tips in team meetings
- Document lessons learned
- Create custom tools/scripts

## Resources

### Documentation Resources

- [Claude Documentation](https://docs.anthropic.com)
- [GitHub Copilot Docs](https://docs.github.com/copilot)
- Project-specific AI guides

### Tools

- Context preparation scripts
- Prompt templates
- Review automation tools
- Security scanning utilities

## Compliance and Ethics

### Usage Guidelines

- Respect licensing of AI-generated code
- Attribute AI assistance where required
- Follow company AI usage policies
- Consider ethical implications

### Audit Trail

- Log AI tool usage
- Document prompts and outputs
- Track code generation sources
- Maintain transparency

---

*Last updated: 2026-05-21*
*Maintained by: portunix-vscode Team*
