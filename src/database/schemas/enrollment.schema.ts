import {
  pgTable,
  integer,
  primaryKey,
  index,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as usersSchema from './user.schema';
import * as coursesSchema from './course.schema';

export const enrollments = pgTable(
  'enrollments',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersSchema.users.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => coursesSchema.courses.id, { onDelete: 'cascade' }),
    enrolledAt: timestamp('enrolled_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.courseId] }),
    index('idx_enrollments_user_id').on(table.userId),
    index('idx_enrollments_course_id').on(table.courseId),
  ],
);

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(usersSchema.users, {
    fields: [enrollments.userId],
    references: [usersSchema.users.id],
  }),
  course: one(coursesSchema.courses, {
    fields: [enrollments.courseId],
    references: [coursesSchema.courses.id],
  }),
}));
