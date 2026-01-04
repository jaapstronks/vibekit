# Items CRUD Example

A complete CRUD (Create, Read, Update, Delete) example demonstrating how to build a data-driven feature with Vibekit.

## What's Included

### Server-side
- `server/storage/items.ts` - File-based JSON storage with CRUD operations
- `server/routes/api/items.ts` - RESTful API endpoints

### Client-side
- `client/views/items/list.js` - List view with table and actions
- `client/views/items/form.js` - Create/edit form with validation

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create a new item |
| GET | `/api/items/:id` | Get a single item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |

## How to Use This Example

1. Copy the files to your project:
   ```bash
   cp -r examples/items-crud/server/storage/items.ts server/storage/
   cp -r examples/items-crud/server/routes/api/items.ts server/routes/api/
   cp -r examples/items-crud/client/views/items client/views/
   ```

2. Register the API handler in `server/routes/api/index.ts`:
   ```typescript
   import { handleItems } from './items.js';

   export async function handleApi(ctx: ApiContext): Promise<void> {
     if (await handleItems(ctx)) return;
     // ... other handlers
   }
   ```

3. Add routes in `client/app.js`:
   ```javascript
   import { renderItemList } from './views/items/list.js';
   import { renderItemForm } from './views/items/form.js';

   route('/', async () => {
     const content = h('div', {});
     renderShell(content, { activeNav: 'items' });
     return renderItemList(content);
   });

   route('/items/new', async () => {
     const content = h('div', {});
     renderShell(content);
     return renderItemForm(content);
   });

   route('/items/:id/edit', async ({ params }) => {
     const content = h('div', {});
     renderShell(content);
     return renderItemForm(content, params.id);
   });
   ```

## Key Patterns Demonstrated

### Server: Handler Chain Pattern
Each API handler returns `true` if it handled the request, `false` otherwise. This allows composing multiple handlers:

```typescript
export async function handleItems(ctx: ApiContext): Promise<boolean> {
  if (path === '/api/items' && method === 'GET') {
    // handle list...
    return true;
  }
  return false; // Not handled
}
```

### Client: View Functions
Views are async functions that render into a container and return a cleanup function:

```javascript
export async function renderItemList(container) {
  // Render UI...
  return () => {
    // Cleanup (event listeners, timers, etc.)
  };
}
```

### Client: Form State Management
Forms use a simple state object with validation:

```javascript
const state = {
  name: '',
  description: '',
  errors: {},
  isSubmitting: false,
};
```
