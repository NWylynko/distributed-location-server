import { Context, Env } from "hono";
import { env } from "../env.js";


export const configHandler = () => async (ctx: Context<Env, "/config", {}>) => {
  return ctx.jsonT({
    INSTANCES_PER_LAYER: env.INSTANCES_PER_LAYER,
    MAP_HEIGHT: env.MAP_HEIGHT,
    MAP_WIDTH: env.MAP_WIDTH,
    OVERLAP: env.OVERLAP,
  })
}