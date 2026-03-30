import * as usersSchemas from './user.schema';
import * as profilesSchemas from './profile.schema';
import * as coursesSchemas from './course.schema';

export const dbSchemas = {
  ...usersSchemas,
  ...profilesSchemas,
  ...coursesSchemas,
};
