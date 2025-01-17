import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).max(65535).optional().default(3000),
  ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .optional()
    .default("development"),
  DATABASE_URL: z.string().url(),
  GEOAPIFY_API_KEY: z.string().trim().min(1),
  JWT_ACEESS_TOKEN_SECRET: z.string().trim().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().trim().min(1),
});

declare module "bun" {
  interface Env extends z.infer<typeof envSchema> {}
}
const parsedEnv = envSchema.safeParse(Bun.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.issues);
  process.exit(1);
}
export const env = parsedEnv.data;
export type Environment = {
  Bindings: z.infer<typeof envSchema>;
};
