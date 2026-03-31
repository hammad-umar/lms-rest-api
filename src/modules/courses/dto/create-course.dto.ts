import { createZodDto } from 'nestjs-zod';
import { CreateCourseSchema } from '../courses.schema';

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
