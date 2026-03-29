import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database-connection';
import * as usersSchema from './schemas/user.schema';
import { ConfigType } from '../config';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService<ConfigType>) => {
        const pool = new Pool({
          connectionString: configService.get('database.url', { infer: true }),
        });
        return drizzle(pool, {
          schema: {
            ...usersSchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
