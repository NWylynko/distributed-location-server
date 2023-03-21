import {type Serve} from "bun";

export default {
  fetch(req: Request) {
    
    return new Response(`Hello Guardian from Bun!`);
  },
  port: 3000,
} satisfies Serve;