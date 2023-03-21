import { z } from "zod";

const envSchema = z.object({
  CONTAINER_API: z.string(),
  INSTANCES_PER_LAYER: z.string().transform((s) => Number(s)),
  MAP_HEIGHT: z.string().transform((s) => Number(s)),
  MAP_WIDTH: z.string().transform((s) => Number(s)),
  OVERLAP: z.string().transform((s) => Number(s)),
});

export const env = envSchema.parse(Bun.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
