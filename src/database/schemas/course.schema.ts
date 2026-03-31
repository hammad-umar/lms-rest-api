import { pgTable, integer, timestamp, text, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as usersSchema from './user.schema';
import * as lessonsSchema from './lesson.schema';
import * as enrollmentsSchema from './enrollment.schema';

export const courses = pgTable(
  'courses',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    description: text(),
    instructorId: integer('instructor_id')
      .notNull()
      .references(() => usersSchema.users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('idx_courses_instructor_id').on(table.instructorId)],
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(usersSchema.users, {
    fields: [courses.instructorId],
    references: [usersSchema.users.id],
  }),
  lessons: many(lessonsSchema.lessons),
  enrollments: many(enrollmentsSchema.enrollments),
}));
