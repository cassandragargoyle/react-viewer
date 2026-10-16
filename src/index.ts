/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Public entry point of @cassandragargoyle/react-viewer
// Document viewers migrate here from portunix-vscode; see its issue 132

export { EmailViewer, formatEmailDate } from './EmailViewer';
export type {
    EmailViewerProps,
    EmailMessage,
    EmailAddress,
    EmailAttachment,
    EmailImportance,
    EmailDateFormatter,
} from './EmailViewer';
