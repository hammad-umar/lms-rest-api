import { createZodDto } from 'nestjs-zod';
import { PaginationSchema } from '../schemas/pagination.schema';

export class PaginationDto extends createZodDto(PaginationSchema) {}
