import {
  pgTable,
  integer,
  text,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as profilesSchema from './profile.schema';
import * as coursesSchema from './course.schema';
import * as enrollmentsSchema from './enrollment.schema';

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    email: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('idx_users_email').on(table.email)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profilesSchema.profiles),
  courses: many(coursesSchema.courses),
  enrollments: many(enrollmentsSchema.enrollments),
}));
