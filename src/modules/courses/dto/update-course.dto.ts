import { createZodDto } from 'nestjs-zod';
import { UpdateCourseSchema } from '../courses.schema';

export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}
