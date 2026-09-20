# Bug Reporting Guidelines

## Overview

This guide helps you report bugs effectively to ensure quick resolution and improve react-viewer.

## Before Reporting

### 1. Search Existing Issues

- Check [existing issues](https://github.com/CassandraGargoyle/react-viewer/issues) first
- Search for similar problems or error messages
- Review closed issues for workarounds

### 2. Verify the Bug

- Reproduce the issue consistently
- Test with the latest version
- Try different environments if possible
- Check if it's a configuration issue

### 3. Gather Information

Collect all relevant details before creating the report:

- Version information
- Environment details
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs

## Bug Report Template

### Title Format

```text
[Component] Brief description of the issue
```

Examples:

- `[API] Authentication fails with valid credentials`
- `[UI] Button not responsive on mobile devices`
- `[Database] Connection timeout in production`

### Report Structure

```markdown
## Bug Description
Brief summary of what's wrong.

## Environment
- **OS**: [Operating system and version]
- **react-viewer Version**: [Version number]
- **Browser/Client**: [If applicable]
- **Language**: [Programming language version]
- **Dependencies**: [Relevant library versions]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three
4. ...

## Expected Behavior
Describe what you expected to happen.

## Actual Behavior
Describe what actually happened.

## Error Messages/Logs

```text
[Paste error messages, stack traces, or relevant logs here]
```

## Screenshots/Videos

[If applicable, attach visual evidence]

## Additional Context

Any other information that might be helpful:

- Workarounds you've tried
- Related issues or PRs
- Impact on your workflow
- Frequency of occurrence

## Possible Solution

```text
[Optional] If you have ideas for fixing the issue
```

## Severity Levels

### Critical

- System crashes or data loss
- Security vulnerabilities
- Complete feature breakdown
- Production environment failures

### High

- Major functionality not working
- Performance degradation
- Significant user experience issues

### Medium

- Minor functionality issues
- Cosmetic problems with workarounds
- Documentation errors

### Low

- Minor cosmetic issues
- Feature enhancement requests
- Nice-to-have improvements

## Issue Labels

### Type Labels

- `bug` - Confirmed bug
- `regression` - Previously working feature now broken
- `performance` - Performance-related issues
- `security` - Security vulnerabilities
- `documentation` - Documentation bugs

### Priority Labels

- `critical` - Needs immediate attention
- `high` - High priority fix needed
- `medium` - Standard priority
- `low` - Low priority, nice to fix

### Component Labels

- `api` - API-related issues
- `ui` - User interface problems
- `database` - Database-related bugs
- `authentication` - Auth system issues
- `deployment` - Deployment/build issues

## Specific Bug Types

### Performance Issues

Include:

- Performance metrics (response times, memory usage)
- Profiler outputs
- System resource usage
- Load conditions when issue occurs

### Security Vulnerabilities

**Note**: Report security issues privately first!

- Email: <cassandragargoyle@gmail.com>
- Use GitHub Security Advisories
- Provide clear impact assessment
- Include proof of concept if safe

### Intermittent Bugs

- Frequency of occurrence
- Patterns you've noticed
- Environmental conditions
- Timing information

### UI/UX Issues

- Screenshots or screen recordings
- Browser developer tools output
- Device specifications
- Accessibility impact

## After Reporting

### Follow Up

- Respond to maintainer questions promptly
- Test proposed fixes
- Provide additional information if requested
- Update the issue if you find workarounds

### Verification

- Test the fix when released
- Confirm the issue is resolved
- Report if the fix introduces new issues

## Tools and Debugging

### Log Collection

```bash
# react-viewer logs
tail -f /var/log/react-viewer/app.log

# System logs
journalctl -u react-viewer.service

# Docker logs
docker logs react-viewer-container
```

### Debug Information

```bash
# Version information
react-viewer --version

# System information
uname -a
lsb_release -a

# Environment variables
env | grep REACT-VIEWER
```

### Network Issues

```bash
# Connection testing
curl -v {{API_ENDPOINT}}/health
ping {{HOSTNAME}}
traceroute {{HOSTNAME}}

# Port testing
netstat -tulpn | grep {{PORT}}
```

## Common Issues

### Installation Problems

- Check system requirements
- Verify dependencies are installed
- Review installation logs
- Try clean installation

### Configuration Issues

- Validate configuration syntax
- Check file permissions
- Verify environment variables
- Review documentation

### Performance Problems

- Monitor resource usage
- Check for memory leaks
- Profile slow operations
- Review system logs

## Example Bug Reports

### Good Bug Report

```markdown
## Bug Description
User authentication fails intermittently with "Invalid token" error

## Environment
- **OS**: Ubuntu 20.04 LTS
- **react-viewer Version**: v1.2.3
- **Browser**: Chrome 91.0.4472.124
- **Node.js**: 14.17.0

## Steps to Reproduce
1. Login with valid credentials
2. Navigate to dashboard
3. Wait 5-10 minutes without activity
4. Try to access user profile
5. Error appears approximately 30% of the time

## Expected Behavior
User should remain authenticated and access profile successfully

## Actual Behavior
Gets "Invalid token" error and is redirected to login page

## Error Messages/Logs

```text
2024-01-15 10:30:45 ERROR: Token validation failed: jwt expired
2024-01-15 10:30:45 DEBUG: Token issued at: 2024-01-15 10:25:30
```

## Additional Context

```text
- Issue started after v1.2.0 upgrade
- Happens more frequently during peak hours
- Clearing browser cache temporarily resolves the issue
```

### Poor Bug Report

```markdown
Title: Login broken

Description: Can't login, please fix ASAP!!!

(Missing all essential information)
```

## Community Guidelines

### Be Respectful

- Use professional language
- Avoid demanding immediate fixes
- Appreciate volunteer maintainers' time

### Provide Value

- Include all requested information
- Test thoroughly before reporting
- Help others with similar issues

### Stay Engaged

- Monitor your issue for updates
- Participate in discussions
- Test proposed solutions

## Automation and Templates

### GitHub Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```yaml
---
name: Bug report
about: Create a report to help us improve
title: '[Bug] '
labels: bug
assignees: ''
---

<!-- Use the bug report template above -->
```

### Automated Information Collection

```bash
#!/bin/bash
# scripts/collect-debug-info.sh
echo "=== portunix-vscode Debug Information ==="
echo "Version: $(portunix-vscode --version)"
echo "OS: $(uname -a)"
echo "Date: $(date)"
echo "Logs (last 50 lines):"
tail -50 /var/log/portunix-vscode/error.log
```

---

**Remember**: Good bug reports help everyone. Take time to provide complete information, and you'll get faster, better help!

*For security vulnerabilities, please follow our [Security Policy](SECURITY.md) and report privately first.*
