import { PgSelect } from 'drizzle-orm/pg-core';
import { PaginationMeta } from '../schemas/pagination.schema';

export const PAGINATION_CONSTRUCTOR = <T extends PgSelect>(
  qb: T,
  page: number,
  limit: number,
): T => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  return qb.limit(safeLimit).offset(offset);
};

export const METADATA_CONSTRUCTOR = (
  page: number,
  limit: number,
  totalItems: number,
  itemCount: number,
): PaginationMeta => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const totalPages = Math.ceil(totalItems / safeLimit);

  return {
    totalItems,
    itemCount,
    itemsPerPage: safeLimit,
    totalPages,
    currentPage: safePage,
  };
};
