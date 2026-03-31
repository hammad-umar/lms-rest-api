import { createZodDto } from 'nestjs-zod';
import { UpdateLessonSchema } from '../lessons.schema';

export class UpdateLessonDto extends createZodDto(UpdateLessonSchema) {}
