import { ENV, envSchema } from './env.schema';

export const validateEnv = (config: Record<string, unknown>): ENV => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      console.error(`❌ ENV ERROR: ${issue.path.join('.')} - ${issue.message}`);
    });
    process.exit(1);
  }

  return parsed.data;
};
