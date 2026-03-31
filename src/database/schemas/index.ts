import * as usersSchemas from './user.schema';
import * as profilesSchemas from './profile.schema';
import * as coursesSchemas from './course.schema';
import * as lessonsSchemas from './lesson.schema';

export const dbSchemas = {
  ...usersSchemas,
  ...profilesSchemas,
  ...coursesSchemas,
  ...lessonsSchemas,
};
