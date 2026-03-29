import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.number(),
    name: z
      .string()
      .min(1, 'Name is required.')
      .max(100, 'Name can not exceed 100 characters.')
      .transform((val) => val.trim()),
    email: z
      .email('Provide valid email address.')
      .transform((val) => val.trim().toLowerCase()),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'User' });

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).meta({ id: 'CreateUser' });

export const UpdateUserSchema = CreateUserSchema.omit({
  email: true,
})
  .partial()
  .meta({ id: 'UpdateUser' });

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
