# React Viewer

React viewers for document formats, shared across the CassandraGargoyle ecosystem.

[![npm](https://img.shields.io/npm/v/@cassandragargoyle/react-viewer)](https://www.npmjs.com/package/@cassandragargoyle/react-viewer)
[![license](https://img.shields.io/npm/l/@cassandragargoyle/react-viewer)](LICENSE)

## Overview

**Repository**: `react-viewer`
**Language**: TypeScript (React 19, Node 24+)
**Package**: [`@cassandragargoyle/react-viewer`](https://www.npmjs.com/package/@cassandragargoyle/react-viewer) on npmjs.com

A viewer shows one kind of document — an e-mail message or a Word document — from data the host has
already read. It never parses a file format and never calls a host API: the host reads the
file, maps it to the viewer's own type, and passes it in as props. General UI building
blocks live next door in [`react-components`](https://github.com/cassandragargoyle/react-components).

Viewers came from `portunix-vscode`; the placement is decided in its
[issue 132](https://github.com/cassandragargoyle/portunix-vscode/blob/main/docs/issues/done/132-shared-modules-and-group-b-components.md)
and [ADR-012](https://github.com/cassandragargoyle/portunix-vscode/blob/main/docs/adr/012-react-components-shared-submodule.md).

## Getting Started

```bash
npm install @cassandragargoyle/react-viewer dompurify
```

React 19 and `dompurify` are peer dependencies. `DocxViewer` also needs the optional peer
`docx-preview` (`npm install docx-preview`).

```tsx
import { EmailViewer, type EmailMessage } from '@cassandragargoyle/react-viewer';

export function MailPane({ email }: { email: EmailMessage }): React.ReactElement {
    return <EmailViewer email={email} />;
}
```

Stylesheets are bundled into the JavaScript and injected on first use; there is no CSS file
to import. Colours follow the Visual Studio Code theme variables when they are present.

## Viewers

| Viewer | What it shows |
| ------ | ------------- |
| [`EmailViewer`](https://github.com/cassandragargoyle/react-viewer/tree/main/src/EmailViewer) | An e-mail message: header, attachments and a sandboxed HTML / text / source / headers body |
| [`DocxViewer`](https://github.com/cassandragargoyle/react-viewer/tree/main/src/DocxViewer) | A Word `.docx` document as pages, with zoom and the page position; needs the optional peer `docx-preview` |

## Development

```bash
git clone https://github.com/cassandragargoyle/react-viewer.git
cd react-viewer

npm install
npm run typecheck
npm run build
npm test
```

## Releasing

Bump `version` in `package.json`, commit, and push a matching `vX.Y.Z` tag. The publish
workflow refuses a tag that does not match `package.json` and publishes to npmjs.com through
npm Trusted Publishing, so no npm token exists in the repository. The trusted publisher
(this repository, `publish.yml`) has to be set in the package settings on npmjs.com before
the first release.

## License

MIT — see [LICENSE](LICENSE).
