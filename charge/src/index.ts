import { type Serve } from "bun";
import { register } from "./register.js";

export type Handler = (req: Request) => Promise<Response>;
type Handlers = Record<string, Handler>

const handlers: Handlers = {
  "/": async (req) => new Response("Hello Guardian from Bun!"),
  "/health": async (req) => new Response("OK"),
}

export default {
  async fetch(req: Request) {
    const { pathname } = new URL(req.url);

    const handler = handlers[pathname];

    if (!handler) {
      return new Response("Not Found", { status: 404 });
    }

    return await handler(req);
  },
  port: 3000,
} satisfies Serve;

const { instance } = await register();

console.log(instance)
