import { z } from 'zod';

export const PaginationSchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .default(1)
      .meta({ description: 'Page number to paginate on.' }),
    limit: z.coerce
      .number()
      .int()
      .default(10)
      .meta({ description: 'Number of items to limit.' }),
  })
  .meta({ id: 'Pagination' });

export const PaginationMetaSchema = z
  .object({
    totalItems: z.int(),
    itemCount: z.int(),
    itemsPerPage: z.int(),
    totalPages: z.int(),
    currentPage: z.int(),
  })
  .meta({ id: 'PaginationMeta' });

export type Pagination = z.infer<typeof PaginationSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
