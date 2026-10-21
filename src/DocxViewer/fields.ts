/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Marks the results of PAGE and NUMPAGES fields in a document parsed by docx-preview
// The renderer shows only the cached value; pagination later writes the real numbers in

/** Class put on the rendered text of a PAGE field result */
export const PAGE_FIELD_CLASS = 'docx-viewer-field-page';
/** Class put on the rendered text of a NUMPAGES field result */
export const NUMPAGES_FIELD_CLASS = 'docx-viewer-field-numpages';

// The part of the docx-preview element tree this module reads. The tree is an internal
// structure of the library, so every access is defensive: an unknown shape marks nothing
interface FieldElement {
    type?: string;
    children?: FieldElement[];
    className?: string;
    fieldRun?: boolean;
    charType?: string;
    text?: string;
}

interface ParsedDocument {
    parts?: { rootElement?: FieldElement }[];
}

// The field a result belongs to, from its instruction (` PAGE \* MERGEFORMAT ` → PAGE)
function fieldClass(instruction: string): string | undefined {
    const name = instruction.trim().split(/\s+/)[0]?.toUpperCase();
    if (name === 'PAGE') return PAGE_FIELD_CLASS;
    if (name === 'NUMPAGES') return NUMPAGES_FIELD_CLASS;
    return undefined;
}

function addClass(elem: FieldElement, className: string): void {
    elem.className = elem.className ? `${elem.className} ${className}` : className;
}

// Walks one part in document order. A complex field is a run sequence
// begin → instruction text → separate → result runs → end; the result runs are marked
function markPart(root: FieldElement): number {
    let marked = 0;
    let instruction = '';
    let state: 'none' | 'instruction' | 'result' = 'none';
    let resultClass: string | undefined;

    // Simple fields (`w:fldSimple`) need nothing here: docx-preview does not render them
    const visit = (elem: FieldElement): void => {
        if (elem.type === 'run' && elem.fieldRun) {
            for (const child of elem.children ?? []) {
                if (child.type === 'complexField') {
                    if (child.charType === 'begin') {
                        state = 'instruction';
                        instruction = '';
                    } else if (child.charType === 'separate') {
                        state = 'result';
                        resultClass = fieldClass(instruction);
                    } else if (child.charType === 'end') {
                        state = 'none';
                        resultClass = undefined;
                    }
                } else if (child.type === 'instruction' && state === 'instruction') {
                    instruction += child.text ?? '';
                }
            }
            return;
        }
        if (elem.type === 'run' && state === 'result') {
            if (resultClass) {
                addClass(elem, resultClass);
                marked++;
            }
            return;
        }
        for (const child of elem.children ?? []) visit(child);
    };

    visit(root);
    return marked;
}

/**
 * Mark the PAGE and NUMPAGES results in every part (body, headers, footers) of a parsed
 * document. Returns how many runs were marked; 0 also for a tree it does not understand
 */
export function markPageFields(document: unknown): number {
    const parts = (document as ParsedDocument | null)?.parts;
    if (!Array.isArray(parts)) return 0;
    let marked = 0;
    for (const part of parts) {
        if (part?.rootElement) marked += markPart(part.rootElement);
    }
    return marked;
}
