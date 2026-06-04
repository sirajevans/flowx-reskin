# FlowX Reskin

Sandbox for FlowX UI chrome and primitives. Stack mirrors the main app: React 19, Vite 7, TypeScript, Tailwind CSS 4, CSS variable theming.

## Commands

```bash
npm install
npm run dev
npm test
```

## Components

- `src/components/positions/PositionsPanel.tsx` — Paper design (positions table widget)

### Command menu

Global command palette for search and quick actions. Built with [cmdk](https://github.com/pacocoursey/cmdk) and styled primitives in `src/components/ui/command.tsx`.

**In the app:** `TerminalCommandMenu` is mounted in `App.tsx` alongside the dashboard. Run `npm run dev` and use the shortcuts below on any view where a text field is not focused.

| Input | Behavior |
| --- | --- |
| Type any letter, number, or symbol | Opens the menu and puts that character in the search field |
| `⌘K` (macOS) / `Ctrl+K` (Windows/Linux) | Opens the menu with an empty search field; press again to close |
| `Escape` | Closes the menu |
| Arrow keys + `Enter` | Navigate and run the highlighted item |

The menu does not open while focus is in an `input`, `textarea`, `select`, or contenteditable field (for example the order amount inputs).

**Adding commands:** Edit `src/components/terminal-command-menu/terminalCommands.ts`.

1. Add an entry to `TERMINAL_COMMAND_GROUPS` (use a stable `value`, display `label`, and optional `keywords` for fuzzy search).
2. Handle that `value` in `runTerminalCommand`.

```ts
// terminalCommands.ts — example
{
  value: 'action-toggle-theme',
  label: 'Toggle theme',
  keywords: ['dark', 'light'],
},
```

```ts
export function runTerminalCommand(value: string) {
  if (value === 'action-toggle-theme') {
    // your logic
  }
}
```

Module entries under **Modules** are searchable labels only until you wire `runTerminalCommand` for their `value` (e.g. `module-positions`). **Reset dashboard layout** clears the stored grid layout and reloads the page.

**Reusing the UI primitives:** Import from `src/components/ui` or `src/components/ui/command.tsx`:

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command';
```

For the same type-to-open behavior in another surface, use `useCommandMenuTypeahead` from `src/hooks/useCommandMenuTypeahead.ts` with your own `open` / search state and `CommandDialog` markup (see `TerminalCommandMenu.tsx`).
