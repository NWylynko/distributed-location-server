import {type Serve} from "bun";

console.log(Bun.env)

export default {
  fetch(req: Request) {
    console.log("request yay", req.url)
    return new Response(`Hello Charge from Bun!`);
  },
  port: 3000,
} satisfies Serve;