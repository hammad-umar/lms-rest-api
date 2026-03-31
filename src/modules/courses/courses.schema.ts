import { z } from 'zod';

export const CourseSchema = z
  .object({
    id: z.int(),
    title: z
      .string()
      .min(1, 'Title is required.')
      .max(100, 'Title can not exceed 100 characters.')
      .transform((val) => val.trim()),
    description: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
    instructorId: z.int('Instructor id is required.'),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'Course' });

export const CreateCourseSchema = CourseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).meta({ id: 'CreateCourse' });

export const UpdateCourseSchema = CreateCourseSchema.partial().meta({
  id: 'UpdateCourse',
});

export type Course = z.infer<typeof CourseSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
