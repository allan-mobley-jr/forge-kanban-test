# KanbanFlow

A minimal, client-side personal task management kanban board. All data stored in localStorage — no authentication, no backend, no server infrastructure.

## Features

- Three columns: **To Do**, **In Progress**, **Done**
- Drag-and-drop cards between columns
- Card detail modal with inline editing and markdown descriptions
- Color labels for visual categorization
- Keyboard shortcuts (`N`, `Escape`, `Cmd+K`, `1/2/3`)
- Quick search across all cards
- Auto-save to localStorage on every change
- Offline-capable after first page load

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [@dnd-kit](https://dndkit.com/) for drag-and-drop
- [react-markdown](https://github.com/remarkjs/react-markdown) for markdown rendering
- [shadcn/ui](https://ui.shadcn.com/) for accessible component primitives
- [vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) for testing

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run unit tests
pnpm test:watch   # Run unit tests in watch mode
pnpm test:e2e     # Run end-to-end tests
```
