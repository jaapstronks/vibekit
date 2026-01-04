/**
 * API Router
 * Main entry point for all API requests.
 * Uses handler chain pattern.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { notFound } from '../../utils/http.js';

export interface ApiContext {
  req: IncomingMessage;
  res: ServerResponse;
  url: URL;
}

/**
 * Main API handler
 * Routes requests to appropriate handlers.
 *
 * Add handlers for your API endpoints. Each handler should return true
 * if it handled the request, false otherwise.
 *
 * Example:
 *   import { handleUsers } from './users.js';
 *
 *   export async function handleApi(ctx: ApiContext): Promise<void> {
 *     if (await handleUsers(ctx)) return;
 *     notFound(ctx.res);
 *   }
 *
 * See examples/items-crud for a complete CRUD example.
 */
export async function handleApi(ctx: ApiContext): Promise<void> {
  // Add your API handlers here:
  // if (await handleUsers(ctx)) return;

  // No handler matched
  notFound(ctx.res);
}
