import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema } from '../users.schema';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
