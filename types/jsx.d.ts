/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// React 19 and the automatic JSX runtime drop the global `JSX` namespace in
// favour of `React.JSX`; the component sources still use the global form

import type * as React from 'react';

// Aliases, not `interface … extends …` — an extending interface is a distinct
// type, so `JSX.Element` would stop being assignable to `React.ReactNode`
declare global {
    namespace JSX {
        type ElementType = React.JSX.ElementType;
        type Element = React.JSX.Element;
        type ElementClass = React.JSX.ElementClass;
        type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
        type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
        type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
        type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
        type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
        type IntrinsicElements = React.JSX.IntrinsicElements;
    }
}
