/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// EmailViewer toolbar: Reply / Reply-All / Forward actions
// Composing is out of scope for issue 075, so the buttons render disabled (future work)

import React from 'react';
import { ReplyIcon, ReplyAllIcon, ForwardIcon } from './icons';

export function EmailToolbar(): JSX.Element {
    return (
        <div className="email-toolbar" role="toolbar" aria-label="Message actions">
            <button className="email-toolbar-btn" type="button" disabled title="Reply (coming soon)">
                <ReplyIcon />
                <span>Reply</span>
            </button>
            <button className="email-toolbar-btn" type="button" disabled title="Reply all (coming soon)">
                <ReplyAllIcon />
                <span>Reply all</span>
            </button>
            <button className="email-toolbar-btn" type="button" disabled title="Forward (coming soon)">
                <ForwardIcon />
                <span>Forward</span>
            </button>
        </div>
    );
}
