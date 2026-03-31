import { pgTable, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as coursesSchema from './course.schema';

export const lessons = pgTable(
  'lessons',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    content: text(),
    courseId: integer('course_id')
      .notNull()
      .references(() => coursesSchema.courses.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('idx_lessons_course_id').on(table.courseId)],
);

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(coursesSchema.courses, {
    fields: [lessons.courseId],
    references: [coursesSchema.courses.id],
  }),
}));
