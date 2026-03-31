import { createZodDto } from 'nestjs-zod';
import { CreateLessonSchema } from '../lessons.schema';

export class CreateLessonDto extends createZodDto(CreateLessonSchema) {}
