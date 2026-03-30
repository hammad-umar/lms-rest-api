import { pgTable, integer, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import * as usersSchema from './user.schema';

export const profiles = pgTable(
  'profiles',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    bio: text().notNull(),
    avatar: text(),
    userId: integer('user_id')
      .notNull()
      .references(() => usersSchema.users.id, { onDelete: 'cascade' }),
  },
  (table) => [uniqueIndex('idx_profiles_user_id').on(table.userId)],
);

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(usersSchema.users, {
    fields: [profiles.userId],
    references: [usersSchema.users.id],
  }),
}));
