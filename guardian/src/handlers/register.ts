import { Context, Env } from "hono"
import { z } from "zod"

import { getContainerPort } from '../getContainerPort.js';
import { type InstancesStore } from "../instances.js";

const schema = z.object({
  containerId: z.string(),
})

export const registerHander = (instancesStore: InstancesStore) => async (ctx: Context<Env, "/register", {}>) => {

  const json = await ctx.req.json<unknown>()
  const { containerId } = await schema.parseAsync(json)

  const instanceId = crypto.randomUUID()
  const { port } = await getContainerPort(containerId)

  const existingInstance = instancesStore.getInstances().find((instance) => instance?.hostname === containerId);


  if (existingInstance) {
    const instance = instancesStore.updateInstance(existingInstance.id, (existingInstance) => {
      if (existingInstance === undefined) return existingInstance // this won't happen but typescript needs it

      return {
        ...existingInstance,
        id: instanceId,
        port,
        timestamp: Date.now()
      }
    })

    return ctx.jsonT({ instance })
  }

  const instance = instancesStore.registerInstance({
    id: instanceId,
    hostname: containerId, 
    port,
    timestamp: Date.now(),
  })

  return ctx.jsonT({ instance })
}