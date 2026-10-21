/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Public entry point of @cassandragargoyle/react-viewer
// Document viewers from portunix-vscode (its issue 132) and new ones such as DocxViewer (issue 136)

export { EmailViewer, formatEmailDate } from './EmailViewer';
export type {
    EmailViewerProps,
    EmailMessage,
    EmailAddress,
    EmailAttachment,
    EmailImportance,
    EmailDateFormatter,
} from './EmailViewer';
export { DocxViewer } from './DocxViewer';
export type { DocxViewerProps, DocxZoom } from './DocxViewer';
