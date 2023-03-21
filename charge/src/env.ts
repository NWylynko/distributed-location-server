import { z } from "zod";

const envSchema = z.object({
  HOSTNAME: z.string(),
  GUARDIAN_API: z.string(),
});

export const env = envSchema.parse(Bun.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
