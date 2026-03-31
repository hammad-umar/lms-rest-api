import { createZodDto } from 'nestjs-zod';
import { CreateEnrollmentSchema } from '../enrollments.schema';

export class CreateEnrollmentDto extends createZodDto(CreateEnrollmentSchema) {}
