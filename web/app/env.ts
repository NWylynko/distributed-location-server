import { z } from "zod";

const envSchema = z.object({
  GUARDIAN_API: z.string(),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
