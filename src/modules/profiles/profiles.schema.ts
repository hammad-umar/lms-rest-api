import { z } from 'zod';

export const ProfileSchema = z
  .object({
    id: z.number(),
    bio: z
      .string()
      .min(1, 'Bio is required.')
      .max(255, 'Bio cannot exceed 255 characters.')
      .transform((val) => val.trim()),
    avatar: z
      .url('Avatar must be a valid URL.')
      .optional()
      .transform((val) => val?.trim()),
    userId: z.number(),
  })
  .meta({ id: 'Profile' });

export const CreateProfileSchema = ProfileSchema.omit({
  id: true,
  userId: true,
}).meta({ id: 'CreateProfile' });

export const UpdateProfileSchema = CreateProfileSchema.partial().meta({
  id: 'UpdateProfile',
});

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
