import { createZodDto } from 'nestjs-zod';
import { SearchSchema } from '../schemas/search.schema';

export class SearchDto extends createZodDto(SearchSchema) {}
