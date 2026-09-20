# .gitignore Template for CassandraGargoyle Projects

## Purpose

This document provides standardized .gitignore templates for different types of CassandraGargoyle projects, ensuring consistent exclusion of files
that should not be tracked in Git.

## Base Template (All Projects)

```gitignore
# Claude Code configuration
.claude/

# Translation files (temporary, generated on demand)  
.translated/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
*.swp
*.swo
*~
.vscode/settings.json
.idea/
*.sublime-workspace
*.sublime-project

# Logs
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Temporary files
tmp/
temp/
.tmp/
```

## Language-Specific Additions

### Go Projects

```gitignore
# Go specific
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/

# Build output
bin/
dist/
```

### Node.js/JavaScript Projects

```gitignore
# Dependencies
node_modules/
jspm_packages/

# Build outputs
build/
dist/
.next/
.nuxt/
.vuepress/dist

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Package manager files
package-lock.json
yarn.lock
.pnp
.pnp.js

# Coverage directory used by tools like istanbul
coverage/
.nyc_output

# TypeScript cache
*.tsbuildinfo
```

### Python Projects

```gitignore
# Python specific
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/
.venv/
.ENV/

# Django
*.log
local_settings.py
db.sqlite3

# Flask
instance/
.webassets-cache

# Pytest
.pytest_cache/
.coverage
htmlcov/
```

### Rust Projects

```gitignore
# Rust specific
/target/
Cargo.lock
**/*.rs.bk
```

### .NET/C# Projects

```gitignore
# .NET specific
bin/
obj/
*.user
*.suo
*.userosscache
*.sln.docstates
.vs/

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
bld/
[Bb]in/
[Oo]bj/

# NuGet
*.nupkg
*.snupkg
.nuget/
packages/
!packages/build/
```

### Docker Projects

```gitignore
# Docker specific
.dockerignore
```

### Database Projects

```gitignore
# Database files
*.db
*.sqlite
*.sqlite3
*.db-journal
```

## Project-Specific Examples

### Complete Go CLI Project

```gitignore
# Base template
.claude/
.translated/
.DS_Store
Thumbs.db
*.swp
*.swo
*~
.vscode/settings.json
.idea/
*.log
logs/
tmp/
temp/

# Go specific
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/
bin/
dist/

# Project specific
config/dev/
docs/private/
*.rc
NOTES.md
GEMINI.md
```

### Complete Node.js Web App

```gitignore
# Base template
.claude/
.translated/
.DS_Store
Thumbs.db
*.swp
*.swo
*~
.vscode/settings.json
.idea/
*.log
logs/
tmp/
temp/

# Node.js specific
node_modules/
build/
dist/
.next/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
package-lock.json
yarn.lock
coverage/
*.tsbuildinfo

# Project specific
uploads/
static/uploads/
public/uploads/
```

## Usage Instructions

### For New Projects

1. **Copy base template** to your project root as `.gitignore`
2. **Add language-specific sections** based on your tech stack
3. **Add project-specific exclusions** as needed
4. **Test the gitignore** with `git status` to ensure proper exclusions

### Common Project-Specific Additions

```gitignore
# Configuration files with sensitive data
config/production.yml
config/secrets.yml
.secrets/

# Build artifacts
build/
dist/
out/

# IDE specific files
.vscode/
.idea/
*.sublime-*

# OS specific files
*.DS_Store
Thumbs.db

# Backup files
*.bak
*.backup
*.orig
```

## Best Practices

### Security Considerations

- Always exclude files containing API keys, passwords, or sensitive data
- Exclude configuration files that contain environment-specific settings
- Never commit database files or credentials

### Performance Considerations

- Exclude large binary files
- Exclude generated files that can be rebuilt
- Exclude dependency directories (node_modules, vendor, etc.)

### Team Collaboration

- Include common IDE configuration exclusions
- Exclude personal development configuration files
- Keep project-specific exclusions documented

### Maintenance

- Review .gitignore quarterly for new exclusions
- Update when adding new tools or dependencies
- Ensure consistency across team projects

## Git Commands for .gitignore

### Apply .gitignore to Already Tracked Files

```bash
# Remove all files from index (keeps local files)
git rm -r --cached .

# Re-add all files (respecting new .gitignore)
git add .

# Commit the changes
git commit -m "Apply updated .gitignore"
```

### Check What Would Be Ignored

```bash
# Show files that would be ignored
git status --ignored

# Check if specific file would be ignored
git check-ignore -v filename
```

---

**Note**: Always customize the .gitignore template based on your specific project needs while maintaining the base CassandraGargoyle standards.

*Created: 2025-08-23*
*Last updated: 2025-08-23*
