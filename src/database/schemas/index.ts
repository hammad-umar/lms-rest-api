import * as usersSchemas from './user.schema';
import * as profilesSchemas from './profile.schema';

export const dbSchemas = {
  ...usersSchemas,
  ...profilesSchemas,
};
