/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Ambient modules the consumer's bundler normally supplies, needed only so the
// package type-checks and builds its .d.ts standalone. Deliberately a global
// script with no top-level import — that would make `declare module` an augmentation

// Stylesheets are imported as an injected string (see the cssAsString plugin)
declare module '*.css' {
    const content: string;
    export default content;
}

// Optional peer that ships no type declarations of its own
declare module 'cytoscape-dagre';
