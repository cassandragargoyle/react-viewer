# Git Workflow for portunix-vscode

## Overview
This document describes the Git workflow and branching strategy for portunix-vscode.

## Branch Structure

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features

### Supporting Branches
- `feature/*` - New features
- `hotfix/*` - Critical fixes
- `release/*` - Release preparation

## Workflow Process

### 1. Feature Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "feat: add login functionality"
git push origin feature/user-authentication

# Create pull request to develop
```

### 2. Release Process
```bash
# Create release branch
git checkout develop
git checkout -b release/v1.2.0

# Prepare release
npm run build
npm run test
git commit -m "chore: prepare release v1.2.0"

# Merge to main and develop
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
```

### 3. Hotfix Process
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-fix

# Apply fix
git commit -m "fix: resolve security vulnerability"

# Merge to both main and develop
git checkout main
git merge hotfix/critical-security-fix
git checkout develop
git merge hotfix/critical-security-fix
```

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(api): handle null values in user data"
git commit -m "docs: update API documentation"
```

## Pull Request Process

### Requirements
- [ ] Feature branch is up to date with target branch
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Changes are reviewed by at least one team member

### Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## Git Configuration

### User Setup
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

### Hooks
```bash
# Pre-commit hook
#!/bin/bash
npm run lint
npm run test:unit
```

## Best Practices

### Do
- Write clear commit messages
- Keep commits atomic and focused
- Rebase feature branches before merging
- Use meaningful branch names
- Review your own changes before requesting review

### Don't
- Commit directly to main
- Push broken code
- Mix multiple features in one branch
- Use generic commit messages
- Force push to shared branches

## Troubleshooting

### Common Issues
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Fix commit message
git commit --amend -m "New message"

# Merge conflicts
git status
# Edit conflicted files
git add .
git commit
```

---

*Follow this workflow to maintain clean Git history and efficient collaboration.*