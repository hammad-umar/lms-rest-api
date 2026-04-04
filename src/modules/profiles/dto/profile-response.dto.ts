import { createZodDto } from 'nestjs-zod';
import { ProfileResponseSchema } from '../profiles.schema';

export class ProfileResponseDto extends createZodDto(ProfileResponseSchema) {}
