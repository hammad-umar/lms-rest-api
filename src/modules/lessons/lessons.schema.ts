import { z } from 'zod';

export const LessonSchema = z
  .object({
    id: z.number(),
    title: z
      .string()
      .min(1, 'Title is required.')
      .max(100, 'Title can not exceed 100 characters.'),
    content: z.string().optional(),
    courseId: z.number('Course id is required.'),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'Lesson' });

export const CreateLessonSchema = LessonSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).meta({ id: 'CreateLesson' });

export const UpdateLessonSchema = CreateLessonSchema.partial().meta({
  id: 'UpdateLesson',
});

export type Lesson = z.infer<typeof LessonSchema>;
export type CreateLesson = z.infer<typeof CreateLessonSchema>;
export type UpdateLesson = z.infer<typeof UpdateLessonSchema>;
