---
title: Terminology Guide
status: Active
created: 2025-09-26
updated: 2026-07-04
author: CassandraGargoyle Team
related:
  - MARKDOWN-STYLE.md
---

# Terminology Guide

## Overview

This document defines key terms and concepts used throughout the portunix-vscode
project. Generic industry terms (Git, CI/CD, etc.) are omitted — only
project-specific and domain-specific terminology is listed here.

## Canvas

- **Canvas** — the core document annotation editor that displays an image with
  overlaid annotations. Registered as a VS Code custom editor. Previously called
  "Document Canvas" (renamed per ADR-005)
- **Canvas File** (`*.canvas.json`) — persistence format containing image
  reference, image dimensions, DPI metadata, and overlays
- **Canvas Type** — determines default tool palette and editor behavior:
  `manual_form`, `template`, `review`
- **Overlay** — a visual annotation placed on top of a document image. Preferred
  term over the deprecated "annotation"
- **Region** — an overlay with shape `rect` (rectangular area of interest)
- **BoundingBox** — rectangle defined by `x`, `y`, `width`, `height` in pixel
  coordinates (top-left origin)
- **Overlay Category** — semantic classification that determines color scheme:
  `field`, `text_zone`, `barcode`, `marker`, `checkbox`, `mark_zone`, `custom`
- **Overlay Shape** — rendering form: `rect`, `ellipse`, `line`
- **Confidence** — recognition score 0.0–1.0 for automatically detected overlays
- **Editable** — flag indicating whether the user can move, resize, or delete
  an overlay

### Canvas Modes

- **View Mode** — default; overlays visible but cannot be created or modified;
  tool palette hidden
- **Edit Mode** — tool palette appears; user can create, move, resize, delete
  editable overlays

### Canvas UI Components

- **Image Canvas** — zoom-and-pan viewport rendering the document image
- **Overlay Layer** — SVG layer rendering all overlays on top of the image
- **Tool Palette** — floating, draggable panel with drawing tools and category selector
- **Detail Panel** — side panel showing properties of selected overlays
- **Overlay Editor** — resize and move handles around selected editable overlays

### Drawing Tools

- **Select** — select/deselect overlays
- **Move** — move overlays
- **Region** (`R`) — create rectangular overlays
- **Ellipse** — create elliptical overlays
- **Line** — create diagonal line overlays
- **Text** — add text annotations
- **Eraser** — delete overlays

## Other Custom Editors

- **Graph Canvas** — custom editor for `*.graph.json` (Cytoscape.js-based visualization, read-only)
- **Workflow Canvas** — custom editor for `*.flow.json` (React Flow-based editing)

## Pilot

- **Pilot** — backend service (gRPC-based) for business logic; runs as a separate Go process
- **Pilot Chat** — conversational AI assistant integrated as a VS Code webview
- **Pilot UI** — shared React chat interface used in both VS Code extension and Electron app
- **Platform Adapter** — abstraction layer for platform differences (`VsCodeAdapter`, `ElectronAdapter`)

## Image Conversion

- **reco-worker** — Portunix plugin for TIFF-to-PNG conversion via gRPC
- **Image Conversion Service** — facade selecting the best available conversion
  backend (gRPC reco-worker → local utif2+pngjs fallback)
- **DPI** — dots per inch; extracted from TIFF IFD tags and stored in
  `image_size.dpiX` / `image_size.dpiY` (defaults to 72 when missing)

## Extension Components

- **Custom Editor** — VS Code API for rendering non-text file editors in webviews
- **Tree Provider** — sidebar tree view component (e.g. `CanvasTreeProvider`, `DevToolsTreeProvider`)
- **View Container** — container in the activity bar (sidebar icon)
- **Dev Tools** — development tools sidebar panel
- **AI Task Platform** — dynamic sidebar section for plugin task discovery and execution
- **MCP** — Model Context Protocol; used for Claude/AI assistant integration

## Terminal

- **Terminal Emulator** — shared UI component for terminal display (VS Code webview and Electron)
- **Boot Sequence** — startup routine displayed in Terminal Emulator (checks Portunix CLI, initializes services)
- **Terminal Content API** — HTTP API exposing terminal content to ptx-agent
- **ptx-agent** — agent tool accessing terminal content via accessibility layer or Terminal Content API

## File Formats

| Extension           | Format                                       |
| ------------------- | -------------------------------------------- |
| `*.canvas.json`     | Canvas file (image reference + overlays)     |
| `*.graph.json`      | Graph data (nodes and edges, Cytoscape.js)   |
| `*.flow.json`       | Workflow data (nodes and edges, React Flow)  |

## Architecture Patterns

- **Thin Client / Thick Server** — UI only on frontend, business logic in Pilot backend
- **Custom Editor Pattern** — established pattern for custom file type editors in webviews (issues #018, #030, #032)
- **Platform Adapter Pattern** — abstracting platform-specific code behind adapters
- **Provider Fallback** — try preferred provider first, fall back to local implementation

## Design Principles

Defined in [DESIGN-PRINCIPLES.md](../DESIGN-PRINCIPLES.md), in priority order:

1. **Automatic over Manual** — prefer automation to user intervention
2. **Zero Configuration** — sensible defaults, no required setup
3. **Convention over Configuration** — follow established patterns
4. **Fail Gracefully** — clear error messages and recovery paths
5. **Progressive Disclosure** — simple interface, advanced features hidden
6. **Respect User Context** — minimize workflow disruption
7. **Predictable Behavior** — consistent results regardless of context

## Deprecated Terms

- **Document Canvas** → **Portunix Canvas** (renamed per ADR-005)
- **Annotations** → **Overlays** (preferred term for individual marks)
- `.annotations.json` → `*.canvas.json` (file format renamed per ADR-005)

## Key ADRs

- **ADR-002** — adopt Portunix Pilot as backend (gRPC architecture)
- **ADR-005** — rename Document Canvas to Portunix Canvas
- **ADR-006** — React Flow for Workflow Canvas
- **ADR-007** — TIFF conversion strategy (reco-worker with local fallback)
- **ADR-008** — Platform Image Conversion Provider abstraction
