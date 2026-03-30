import { pgTable, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as usersSchema from './user.schema';

export const courses = pgTable('courses', {
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
});

export const coursesRelations = relations(courses, ({ one }) => ({
  instructor: one(usersSchema.users, {
    fields: [courses.instructorId],
    references: [usersSchema.users.id],
  }),
}));
