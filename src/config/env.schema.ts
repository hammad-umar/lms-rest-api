import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
});

export type ENV = z.infer<typeof envSchema>;
