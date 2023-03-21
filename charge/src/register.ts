import { z } from "zod"
import { env } from "./env.js"

const schema = z.object({
  instance: z.object({
    id: z.string(),
    hostname: z.string(),
    port: z.string(),
    timestamp: z.number(),
    height: z.number(),
    width: z.number(),
    layer: z.number(),
    row: z.number(),
    column: z.number()
  })
})

export const register = async () => {
  const url = new URL(env.GUARDIAN_API)
  url.pathname = '/register'
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ containerId: env.HOSTNAME })
  })
  const text = await response.json()
  return await schema.parseAsync(text)
}