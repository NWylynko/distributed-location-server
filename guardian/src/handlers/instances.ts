import { Context, Env } from "hono";

import { type InstancesStore } from "../instances.js";

export const instancesHandler = (instancesStore: InstancesStore) => async (ctx: Context<Env, "/instances", {}>) => {
  return ctx.jsonT({ instances: instancesStore.getInstances() })
}