import { createZodDto } from 'nestjs-zod';
import { CreateProfileSchema } from '../profiles.schema';

export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}
