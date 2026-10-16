/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Public exports for the EmailViewer component
// Re-exports the read-only e-mail viewer, the message shape it renders and its date format

export { EmailViewer } from './EmailViewer';
export type { EmailViewerProps } from './EmailViewer';
export { formatEmailDate } from './types';
export type { EmailMessage, EmailAddress, EmailAttachment, EmailImportance, EmailDateFormatter } from './types';
