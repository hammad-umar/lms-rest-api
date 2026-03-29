import appConfig from './app.config';
import databaseConfig from './database.config';

export type ConfigType = {
  app: ReturnType<typeof appConfig>;
  database: ReturnType<typeof databaseConfig>;
};
