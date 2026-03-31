import { z } from 'zod';

export const EnrollmentSchema = z
  .object({
    userId: z.number(),
    courseId: z.number(),
    enrolledAt: z.iso.datetime(),
  })
  .meta({ id: 'Enrollment' });

export const CreateEnrollmentSchema = EnrollmentSchema.omit({
  enrolledAt: true,
}).meta({ id: 'CreateEnrollment' });

export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;
