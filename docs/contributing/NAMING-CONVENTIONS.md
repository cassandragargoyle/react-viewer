# Naming Conventions for portunix-vscode

## Overview

This document defines naming conventions used throughout the portunix-vscode project to ensure consistency and readability across all code, documentation, and resources.

## General Principles

### Universal Guidelines

- **Use English**: All names must be in English
- **Be descriptive**: Names should clearly indicate purpose or function
- **Avoid abbreviations**: Prefer `userManager` over `usrMgr`
- **Use consistent terminology**: Stick to established terms (see [Terminology Guide](TERMINOLOGY.md))
- **Consider context**: Names should make sense within their scope

### Prohibited Practices

- Single letter variables (except loop counters `i`, `j`, `k`)
- Misleading names that don't reflect actual purpose
- Overly abbreviated names that sacrifice clarity
- Names using non-English words or transliterations
- Names containing numbers without clear meaning

## File and Directory Naming

### Directory Structure

```text
portunix-vscode/
├── src/                    # Source code
├── docs/                   # Documentation
├── tests/                  # Test files
├── scripts/                # Build and utility scripts
├── config/                 # Configuration files
├── templates/              # Template files
└── assets/                 # Static assets
```

### File Naming Patterns

- **Source files**: `kebab-case` - `user-manager.js`, `data-processor.go`
- **Configuration**: `kebab-case` - `database-config.yaml`, `app-settings.json`
- **Documentation**: `SCREAMING-KEBAB-CASE` - `README.md`, `API-REFERENCE.md`
- **Test files**: `kebab-case` with suffix - `user-manager.test.js`, `data-processor_test.go`
- **Scripts**: `kebab-case` - `build-project.sh`, `deploy-app.py`

### Special File Types

- **Makefiles**: `Makefile`, `Makefile.local`
- **Docker**: `Dockerfile`, `docker-compose.yml`
- **CI/CD**: `.github/workflows/ci.yml`, `.gitlab-ci.yml`
- **Ignore files**: `.gitignore`, `.dockerignore`

## Programming Language Conventions

### JavaScript/TypeScript

```javascript
// Variables and functions: camelCase
const userName = 'john';
const calculateTotalPrice = (items) => { };

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Classes: PascalCase
class UserManager {
    constructor() { }
}

// Interfaces (TypeScript): PascalCase with 'I' prefix
interface IUserService {
    getUser(id: string): User;
}

// Enums: PascalCase
enum OrderStatus {
    Pending = 'pending',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

// Private methods: camelCase with underscore prefix
class Service {
    _privateMethod() { }
    publicMethod() { }
}
```

### Go

```go
// Package names: lowercase, single word
package userservice

// Variables and functions: camelCase
var userName string
func calculateTotal() int { }

// Exported functions: PascalCase
func GetUserByID(id string) (*User, error) { }

// Constants: camelCase or PascalCase depending on visibility
const maxRetries = 3        // unexported
const DefaultTimeout = 30   // exported

// Structs: PascalCase
type UserManager struct {
    name string
}

// Interfaces: PascalCase, often ending with 'er'
type UserReader interface {
    ReadUser(id string) (*User, error)
}

// Methods: PascalCase for exported, camelCase for unexported
func (u *UserManager) GetName() string { }    // exported
func (u *UserManager) setName() { }           // unexported
```

### Python

```python
# Variables and functions: snake_case
user_name = 'john'
def calculate_total_price(items):
    pass

# Constants: SCREAMING_SNAKE_CASE
MAX_RETRY_COUNT = 3
API_BASE_URL = 'https://api.example.com'

# Classes: PascalCase
class UserManager:
    def __init__(self):
        pass

# Private methods: single underscore prefix
class Service:
    def _private_method(self):
        pass
    
    def public_method(self):
        pass

# "Really" private: double underscore prefix
class Advanced:
    def __private_method(self):
        pass

# Module names: snake_case
import user_service
from data_processor import ProcessData
```

### Java

```java
// Variables and methods: camelCase
String userName = "john";
public void calculateTotalPrice() { }

// Constants: SCREAMING_SNAKE_CASE
public static final int MAX_RETRY_COUNT = 3;
private static final String API_BASE_URL = "https://api.example.com";

// Classes and interfaces: PascalCase
public class UserManager {
    // Constructor matches class name
    public UserManager() { }
}

public interface UserService {
    User getUser(String id);
}

// Packages: lowercase with dots
package com.organization.portunix-vscode.service;

// Enums: PascalCase
public enum OrderStatus {
    PENDING("pending"),
    COMPLETED("completed"),
    CANCELLED("cancelled");
}

// Generic type parameters: single uppercase letter
public class Repository<T, ID> {
    // Implementation
}
```

### C/C++

```cpp
// Variables and functions: snake_case
int user_count = 0;
void calculate_total() { }

// Constants: SCREAMING_SNAKE_CASE
#define MAX_BUFFER_SIZE 1024
const int DEFAULT_TIMEOUT = 30;

// Classes and structs: PascalCase
class UserManager {
public:
    UserManager();
    ~UserManager();
    
private:
    std::string user_name_;  // member variables with trailing underscore
};

// Namespaces: snake_case
namespace user_service {
    void process_user();
}

// Macros: SCREAMING_SNAKE_CASE
#define CHECK_ERROR(result) \
    if ((result) != SUCCESS) { \
        return ERROR; \
    }

// Global variables: g_ prefix (avoid when possible)
int g_global_counter = 0;
```

## Database Naming

### Table Names

- **Style**: `snake_case`, plural nouns
- **Examples**: `users`, `order_items`, `user_permissions`

### Column Names

- **Style**: `snake_case`
- **Primary keys**: `id` or `{table}_id`
- **Foreign keys**: `{referenced_table}_id`
- **Timestamps**: `created_at`, `updated_at`
- **Boolean flags**: `is_active`, `has_permission`

### Index Names

- **Pattern**: `idx_{table}_{columns}`
- **Examples**: `idx_users_email`, `idx_orders_user_id_created_at`

### Constraint Names

- **Primary key**: `pk_{table}`
- **Foreign key**: `fk_{table}_{referenced_table}`
- **Unique**: `uk_{table}_{columns}`
- **Check**: `ck_{table}_{column}`

## API and URL Naming

### REST Endpoints

- **Resources**: Plural nouns in `kebab-case`
- **Nested resources**: Clear hierarchy
- **Query parameters**: `snake_case`

```text
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{user-id}
PUT    /api/v1/users/{user-id}
DELETE /api/v1/users/{user-id}
GET    /api/v1/users/{user-id}/orders?sort_by=created_at
```

### GraphQL

- **Types**: PascalCase - `User`, `OrderItem`
- **Fields**: camelCase - `firstName`, `createdAt`
- **Arguments**: camelCase - `userId`, `sortBy`
- **Enums**: PascalCase - `OrderStatus`

## Configuration and Environment

### Environment Variables

- **Style**: `SCREAMING_SNAKE_CASE`
- **Prefix with project**: `PORTUNIX-VSCODE_DATABASE_URL`
- **Common patterns**:
  - `PORTUNIX-VSCODE_PORT`
  - `PORTUNIX-VSCODE_LOG_LEVEL`
  - `PORTUNIX-VSCODE_API_KEY`

### Configuration Files

- **JSON/YAML keys**: `snake_case`

```yaml
database:
  host: localhost
  port: 5432
  connection_timeout: 30
  
api:
  base_url: https://api.example.com
  rate_limit: 1000
```

## Testing Conventions

### Test Files

- **Unit tests**: `{component}.test.{ext}` or `{component}_test.{ext}`
- **Integration tests**: `{component}.integration.{ext}`
- **End-to-end tests**: `{feature}.e2e.{ext}`

### Test Names

```javascript
// Describe blocks: natural language
describe('UserManager', () => {
    describe('when creating a new user', () => {
        it('should generate a unique ID', () => {
            // Test implementation
        });
        
        it('should validate required fields', () => {
            // Test implementation
        });
    });
});
```

### Test Data

- **Fixtures**: `{context}-fixture.json`
- **Mocks**: `mock-{service}.js`
- **Factories**: `{entity}-factory.js`

## Git and Version Control

### Branch Names

- **Feature branches**: `feature/{description}` - `feature/user-authentication`
- **Bug fixes**: `fix/{description}` - `fix/login-validation-error`
- **Hotfixes**: `hotfix/{description}` - `hotfix/security-patch`
- **Release branches**: `release/{version}` - `release/v1.2.0`

### Commit Messages

```text
type(scope): description

feat(auth): add OAuth2 integration
fix(api): handle null values in user data
docs(readme): update installation instructions
refactor(db): optimize user query performance
test(user): add validation test cases
```

### Tag Names

- **Releases**: `v{major}.{minor}.{patch}` - `v1.0.0`, `v2.1.3`
- **Pre-releases**: `v{version}-{stage}.{number}` - `v1.0.0-beta.1`

## Documentation Naming

### Markdown Files

- **Primary docs**: `SCREAMING-KEBAB-CASE` - `README.md`, `API-REFERENCE.md`
- **Contributing docs**: `SCREAMING-KEBAB-CASE` - `CODE-STYLE-GUIDE.md`
- **Guides**: `kebab-case` - `getting-started.md`, `deployment-guide.md`

### Sections and Headings

- **Use sentence case**: "Getting started with authentication"
- **Be descriptive**: "Configure database connection" not "Database"
- **Consistent structure**: Follow established heading hierarchy

## Error Messages and Logging

### Error Codes

- **Pattern**: `PORTUNIX-VSCODE_ERROR_{CATEGORY}_{SPECIFIC}`
- **Examples**: 
  - `PORTUNIX-VSCODE_ERROR_AUTH_INVALID_TOKEN`
  - `PORTUNIX-VSCODE_ERROR_DB_CONNECTION_FAILED`

### Log Messages

- **Use structured logging**: Include context and identifiers
- **Consistent format**: `[LEVEL] Component: Message (context)`
- **Examples**:
  - `[ERROR] UserService: Failed to create user (user_id: 12345, error: validation_failed)`
  - `[INFO] DatabaseManager: Connection established (host: localhost, db: portunix-vscode)`

## Project-Specific Conventions

### portunix-vscode Specific Terms

- **[Term 1]**: [Definition and naming rules]
- **[Term 2]**: [Definition and naming rules]
- **[Term 3]**: [Definition and naming rules]

### Domain-Specific Naming

- **Business Logic**: [Naming patterns for business concepts]
- **Technical Components**: [Naming patterns for technical elements]
- **Integrations**: [Naming patterns for external integrations]

## Tools and Validation

### Automated Checking

- **Linters**: Configure language-specific linters for naming
- **Pre-commit hooks**: Validate naming conventions before commits
- **CI/CD**: Include naming validation in build pipeline

### Recommended Tools

- **ESLint**: JavaScript/TypeScript naming rules
- **golint**: Go naming conventions
- **pylint**: Python naming standards
- **Checkstyle**: Java naming validation

## Migration and Legacy Code

### Handling Existing Code

1. **Document exceptions**: List legacy naming that doesn't follow conventions
2. **Gradual migration**: Update naming during refactoring
3. **Wrapper approach**: Create well-named interfaces for legacy components
4. **Team agreement**: Get consensus on migration timeline

### Deprecation Process

1. **Mark as deprecated**: Add deprecation warnings
2. **Provide alternatives**: Suggest correctly named replacements
3. **Migration timeline**: Set deadline for updates
4. **Remove gradually**: Phase out deprecated names

---

**Remember**: Consistent naming improves code readability, maintainability, and team collaboration. When in doubt, choose clarity over brevity.

*These conventions should be followed for all new code in portunix-vscode. For questions or suggestions, refer to the [Terminology Guide](TERMINOLOGY.md) or discuss with the team.*