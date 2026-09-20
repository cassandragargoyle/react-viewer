# Translation Workflow for portunix-vscode

## Overview

This document outlines the translation process for internationalizing portunix-vscode.

## Supported Languages

### Primary Languages

- **English (en)**: Default language, source for all translations
- **Czech (cs)**: Czech localization
- **German (de)**: German localization
- **French (fr)**: French localization
- **Spanish (es)**: Spanish localization

### Language Codes

Use ISO 639-1 language codes:

- `en` - English
- `cs` - Czech
- `de` - German
- `fr` - French
- `es` - Spanish

## Directory Structure

```text
locales/
├── en/
│   ├── common.json
│   ├── ui.json
│   └── errors.json
├── cs/
│   ├── common.json
│   ├── ui.json
│   └── errors.json
└── templates/
    ├── common.json
    └── ui.json
```

## Translation Files

### JSON Format

```json
{
  "welcome": "Welcome to portunix-vscode",
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit"
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred: {{error}}"
  }
}
```

### Key Naming Conventions

- Use lowercase with dots: `user.profile.name`
- Group related keys: `buttons.save`, `buttons.cancel`
- Use descriptive names: `error.validation.email`
- Avoid abbreviations: use `button` not `btn`

## Translation Process

### 1. Source Text Creation

```javascript
// Mark text for translation
t('welcome.message')
t('user.greeting', { name: userName })
t('items.count', { count: itemCount })
```

### 2. Key Extraction

```bash
# Extract translatable strings
npm run extract-i18n

# Generate translation templates
npm run generate-templates
```

### 3. Translation Assignment

- Assign languages to translators
- Provide context and screenshots
- Set deadlines for completion
- Share translation guidelines

### 4. Quality Assurance

- Review translations for accuracy
- Test in application context
- Check for UI layout issues
- Verify placeholder interpolation

## Translation Guidelines

### General Rules

- Maintain consistent tone and style
- Consider cultural context
- Keep text length similar to English
- Preserve HTML tags and placeholders
- Test with actual UI components

### Technical Considerations

- **Pluralization**: Handle singular/plural forms
- **Gender**: Consider grammatical gender
- **RTL Languages**: Right-to-left text direction
- **Character Sets**: Unicode support
- **Date/Time**: Locale-specific formatting

### Examples

```json
{
  "items": {
    "zero": "No items",
    "one": "{{count}} item",
    "other": "{{count}} items"
  },
  "date": {
    "format": "MM/DD/YYYY",
    "format_cs": "DD.MM.YYYY",
    "format_de": "DD.MM.YYYY"
  }
}
```

## Tools and Libraries

### i18next (Recommended)

```javascript
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

### React Integration

```jsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <button onClick={() => i18n.changeLanguage('cs')}>
        Czech
      </button>
    </div>
  );
}
```

## Automation

### CI/CD Integration

```yaml
# .github/workflows/translations.yml
name: Translation Check
on: [push, pull_request]

jobs:
  check-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check missing translations
        run: npm run check-translations
      - name: Validate JSON files
        run: npm run validate-translations
```

### Scripts

```bash
#!/bin/bash
# scripts/check-translations.sh

echo "Checking for missing translation keys..."
for lang in cs de fr es; do
  echo "Checking $lang..."
  diff <(jq -r 'keys[]' locales/en/common.json | sort) \
       <(jq -r 'keys[]' locales/$lang/common.json | sort) \
       || echo "Missing keys in $lang"
done
```

## Testing Translations

### Automated Tests

```javascript
describe('Translations', () => {
  test('all keys exist in all languages', () => {
    const languages = ['en', 'cs', 'de', 'fr'];
    const enKeys = getTranslationKeys('en');
    
    languages.forEach(lang => {
      const langKeys = getTranslationKeys(lang);
      expect(langKeys).toEqual(enKeys);
    });
  });
  
  test('interpolation works correctly', () => {
    const result = t('welcome.user', { name: 'John' });
    expect(result).toContain('John');
  });
});
```

### Manual Testing Checklist

- [ ] Text displays correctly in UI
- [ ] No text overflow or truncation
- [ ] Placeholders are replaced
- [ ] Pluralization works
- [ ] Date/time formats are correct
- [ ] Currency formats are localized

## Collaboration Workflow

### Using Translation Services

- **Crowdin**: Collaborative translation platform
- **Lokalise**: Translation management system
- **Weblate**: Free/open source translation tool
- **Phrase**: Professional translation platform

### Version Control

```bash
# Branch for translation updates
git checkout -b translations/update-cs-locale

# Commit translation changes
git add locales/cs/
git commit -m "Update Czech translations"

# Create pull request
git push origin translations/update-cs-locale
```

## Maintenance

### Regular Tasks

- Review and update translations
- Add new languages as needed
- Remove obsolete translation keys
- Update translation tools and libraries
- Monitor translation completeness

### Performance Considerations

- Lazy load translation files
- Cache translations appropriately
- Minimize bundle size impact
- Use CDN for translation assets

---

*Effective internationalization makes portunix-vscode accessible to a global audience.*