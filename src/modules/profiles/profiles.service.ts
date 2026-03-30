import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { ERROR_MESSAGES } from '../../common/constants';
import { CreateProfileDto } from './dto/create-profile.dto';
import { dbSchemas } from '../../database/schemas';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async create(userId: number, createProfileDto: CreateProfileDto) {
    const [user] = await this.db
      .select()
      .from(dbSchemas.users)
      .where(eq(dbSchemas.users.id, userId));

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    const [alreadyExists] = await this.db
      .select()
      .from(dbSchemas.profiles)
      .where(eq(dbSchemas.profiles.userId, userId));

    if (alreadyExists) {
      throw new UnprocessableEntityException(
        ERROR_MESSAGES.ALREADY_EXISTS('Profile'),
      );
    }

    const profile = await this.db
      .insert(dbSchemas.profiles)
      .values({ ...createProfileDto, userId })
      .returning();

    return profile;
  }

  async findOne(userId: number) {
    const [profile] = await this.db
      .select()
      .from(dbSchemas.profiles)
      .where(eq(dbSchemas.profiles.userId, userId));

    if (!profile) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Profile'));
    }

    return profile;
  }
}
