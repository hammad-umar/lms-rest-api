import { z } from 'zod';

export const SearchSchema = z
  .object({
    searchTerm: z
      .string()
      .optional()
      .transform((val) => val?.trim()?.toLowerCase())
      .meta({
        description: 'Search term to find items',
      }),
  })
  .meta({ id: 'Search' });

export type Search = z.infer<typeof SearchSchema>;
