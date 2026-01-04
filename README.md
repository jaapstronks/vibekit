# Vibekit

A boring but accessible starter kit for building internal tool applications.

## Philosophy

**"Boring" UI that just works.** The application chrome should be invisible - users focus on the content they're creating, not the tool itself.

- **Minimal dependencies** - Every dependency is a liability
- **No magic** - Explicit over implicit, readable by newcomers
- **Accessible by default** - WCAG AA compliant, keyboard navigable
- **File-based everything** - No database setup required

## Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript (server), JavaScript (client) |
| UI Components | [Shoelace](https://shoelace.style/) web components |
| Build | esbuild (client bundling) |
| Styling | CSS Variables + minimal utilities |
| Server | Native Node.js HTTP (no framework) |
| Testing | Vitest (unit) + Playwright (E2E) |
| Linting | ESLint + Prettier |

### Build System

The client uses [esbuild](https://esbuild.github.io/) to bundle JavaScript and Shoelace components:

- **Fast** - Builds complete in <100ms
- **Local dependencies** - No CDN or external runtime dependencies
- **Tree-shaking** - Only bundles components you use
- **Watch mode** - `npm run dev:client` for live rebuilds

The build runs automatically on `npm install` and before starting the dev server.

### Why JavaScript for the Client?

The client uses plain JavaScript (not TypeScript) intentionally:

- **JSDoc for types** - Get IDE autocomplete without compilation overhead
- **Simpler debugging** - Source maps are optional, source is readable
- **Easier onboarding** - Newcomers can read and modify code immediately

To add TypeScript to the client, update `scripts/build-client.js` to use `.ts` entry points.

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/vibekit.git my-app
cd my-app
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the demo app.

## Project Structure

```
vibekit/
├── client/                 # Browser code (ESM)
│   ├── index.html         # Entry point
│   ├── app.js             # Application bootstrap
│   ├── lib/               # Utilities
│   │   ├── api.js         # API client
│   │   ├── dom.js         # DOM helpers
│   │   ├── router.js      # Client-side routing
│   │   ├── toast.js       # Notifications
│   │   ├── dialogs.js     # Confirm/alert/prompt
│   │   ├── theme.js       # Light/dark mode
│   │   ├── components.js  # UI component helpers
│   │   ├── shoelace.js    # Shoelace form helpers
│   │   ├── validation.js  # Form validation
│   │   ├── loading.js     # Loading states
│   │   ├── file-upload.js # File upload helpers
│   │   ├── tabs.js        # Tab interface
│   │   └── markdown-field.js  # Markdown editor
│   ├── views/             # Route views
│   └── styles/            # CSS
│       ├── tokens.css     # Design tokens
│       ├── reset.css      # CSS reset
│       ├── shoelace-theme.css  # Shoelace overrides
│       ├── base.css       # Element styles
│       ├── components.css # Component styles
│       └── utilities.css  # Utility classes
│
├── server/                # Node.js server
│   ├── server.ts          # Entry point
│   ├── config/            # Configuration
│   ├── routes/            # HTTP handlers
│   │   ├── api/          # API endpoints
│   │   └── static.ts     # Static file server
│   ├── storage/           # Data access
│   └── utils/             # Helpers (http.ts, llm.ts)
│
├── examples/              # Example features
│   └── items-crud/        # Complete CRUD example
│
├── tests/                 # Tests
│   ├── unit/             # Vitest
│   └── e2e/              # Playwright
│
└── docs/                  # Documentation
```

## Available Scripts

```bash
npm run dev          # Build client + start dev server with watch mode
npm run dev:client   # Watch mode for client builds only
npm run start        # Start production server
npm run build        # Build client + TypeScript
npm run build:client # Build client JavaScript only
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run check        # Run all checks
```

## UI Components

Vibekit uses [Shoelace](https://shoelace.style/) for UI components. Components are bundled with esbuild, so they're available offline with no external dependencies. Common patterns are wrapped in helper functions.

### Shoelace Helpers

Create Shoelace elements with less boilerplate using `lib/shoelace.js`:

```javascript
import { slInput, slButton, slSelect, slTextarea, slSwitch } from './lib/shoelace.js';

// Input with all options
const emailInput = slInput({
  label: 'Email',
  type: 'email',
  placeholder: 'you@example.com',
  required: true,
  helpText: 'We will never share your email',
  onInput: (e) => console.log(e.target.value)
});

// Select with options
const roleSelect = slSelect({
  label: 'Role',
  placeholder: 'Choose a role',
  options: [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
    { value: 'guest', label: 'Guest', disabled: true }
  ],
  onChange: (e) => console.log(e.target.value)
});

// Button with icon
const submitBtn = slButton({
  label: 'Save Changes',
  variant: 'primary',
  prefixIcon: 'check',
  onClick: handleSubmit
});
```

### Component Helpers

Common patterns are wrapped in helper functions:

### Page Header

```javascript
import { pageHeader } from './lib/components.js';

pageHeader({
  title: 'Items',
  subtitle: '12 items',
  actions: [
    h('sl-button', { variant: 'primary' }, ['New Item'])
  ]
});
```

### Form Group

```javascript
import { formGroup } from './lib/components.js';

const input = document.createElement('sl-input');
input.required = true;

formGroup({
  label: 'Name',
  id: 'item-name',
  required: true,
  help: 'Enter the item name',
  error: null, // or error message
  input: input
});
```

### Data Table

```javascript
import { dataTable } from './lib/components.js';

dataTable({
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', width: '100px' }
  ],
  data: items,
  renderCell: (row, col) => row[col.key],
  renderActions: (row) => [
    h('sl-icon-button', { name: 'pencil', label: 'Edit' }),
    h('sl-icon-button', { name: 'trash', label: 'Delete' })
  ],
  emptyMessage: 'No items yet'
});
```

### Dialogs

```javascript
import { confirm, confirmDelete, alert, prompt } from './lib/dialogs.js';

// Confirmation
const confirmed = await confirm({
  title: 'Confirm Action',
  message: 'Are you sure?',
  confirmText: 'Yes',
  cancelText: 'No',
  variant: 'primary' // or 'danger'
});

// Delete confirmation
const shouldDelete = await confirmDelete('Item Name');

// Alert
await alert({
  title: 'Notice',
  message: 'Something happened'
});

// Prompt
const value = await prompt({
  title: 'Rename',
  label: 'New name',
  value: 'Current name'
});
```

### Toasts

```javascript
import { success, error, warning, info } from './lib/toast.js';

success('Item saved');
error('Failed to save');
warning('Check your input');
info('New version available');
```

## App Shell Variants

Three shell layouts are available via CSS classes:

### Minimal Shell
```html
<div class="vk-shell-minimal">
  <header class="vk-header">...</header>
  <main class="vk-main">...</main>
</div>
```

### Header Shell (default)
```html
<div class="vk-shell-header">
  <header class="vk-header">
    <a class="vk-header-logo">Logo</a>
    <nav class="vk-header-nav">...</nav>
    <div class="vk-header-spacer"></div>
    <div class="vk-header-actions">...</div>
  </header>
  <main class="vk-main">...</main>
</div>
```

### Sidebar Shell
```html
<div class="vk-shell-sidebar">
  <aside class="vk-sidebar">
    <div class="vk-sidebar-header">...</div>
    <nav class="vk-sidebar-nav">...</nav>
    <div class="vk-sidebar-footer">...</div>
  </aside>
  <div class="vk-content">
    <header class="vk-topbar">...</header>
    <main class="vk-main">...</main>
  </div>
</div>
```

## Adding a New Feature

1. **Create API endpoint** in `server/routes/api/`
2. **Add storage** in `server/storage/`
3. **Create view** in `client/views/`
4. **Add route** in `client/app.js`
5. **Register handler** in `server/routes/api/index.ts`

See `examples/items-crud/` for a complete CRUD example with:
- File-based JSON storage
- RESTful API endpoints
- List and form views
- Full validation and error handling

## Theming

Design tokens are in `client/styles/tokens.css`. Override Shoelace in `client/styles/shoelace-theme.css`.

The theme supports light and dark mode automatically based on system preference, with manual override available.

## Accessibility

Every Vibekit app includes:

- Skip link (first focusable element)
- Visible focus indicators
- ARIA labels on interactive elements
- Screen reader announcements for dynamic content
- Keyboard navigation support

## License

MIT
