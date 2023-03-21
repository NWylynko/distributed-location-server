import { env } from './env.js';
import { z } from "zod"

const schema = z.object({
  port: z.string()
})

export async function getContainerPort(containerId: string) {
  const url = new URL(env.CONTAINER_API);
  url.searchParams.set("containerId", containerId);
  const response = await fetch(url);
  const text = await response.json();
  return await schema.parseAsync(text);
}
