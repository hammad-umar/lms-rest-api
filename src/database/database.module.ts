import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigType } from '../config';
import { dbSchemas } from './schemas';

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
            ...dbSchemas,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
