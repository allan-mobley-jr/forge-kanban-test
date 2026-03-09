# KanbanFlow

Personal task management kanban board.

## Overview

A minimal, client-side kanban board for personal task management. All data stored in localStorage -- no authentication, no backend. Designed for a single user who wants a fast, keyboard-driven way to organize tasks.

## Features

### Board Layout
- Three default columns: **To Do**, **In Progress**, **Done**
- Drag-and-drop cards between columns
- Cards stack vertically within each column
- Responsive layout that works on desktop and tablet

### Cards
- Each card has a title (required) and optional markdown description
- Color labels (at least 5 colors) for visual categorization
- Click a card to open a detail modal
- Create new cards with a "+" button at the bottom of each column
- Delete cards from the detail modal

### Card Detail Modal
- Edit title inline
- Markdown description with live preview
- Select/deselect color labels
- Created date displayed
- Delete button with confirmation

### Keyboard Shortcuts
- `N` — New card in the first column
- `Escape` — Close modal
- `Ctrl+K` / `Cmd+K` — Quick search across all cards
- `1` / `2` / `3` — Focus column by number

### Data Persistence
- All board state saved to localStorage
- Auto-save on every change
- No data loss on page refresh

## Design
- Minimal Tailwind CSS design
- Clean whitespace, no visual clutter
- Accessible: proper ARIA labels, focus management, keyboard navigation
- Offline-capable: works without network after first load
