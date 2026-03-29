import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '../users.schema';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
