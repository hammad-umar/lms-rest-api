import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  METADATA_CONSTRUCTOR,
  PAGINATION_CONSTRUCTOR,
} from '../../common/utils/pagination';
import { dbSchemas } from '../../database/schemas';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [user] = await this.db
      .insert(dbSchemas.users)
      .values(createUserDto)
      .returning();

    return user;
  }

  async find(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const baseQuery = this.db
      .select()
      .from(dbSchemas.users)
      .leftJoin(
        dbSchemas.profiles,
        eq(dbSchemas.users.id, dbSchemas.profiles.userId),
      )
      .$dynamic();

    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db.select({ value: count() }).from(dbSchemas.users),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    const mappedItems = items.map((item) => ({
      ...item.users,
      profile: item.profiles,
    }));

    return { items: mappedItems, meta };
  }

  async findOne(id: number) {
    const [result] = await this.db
      .select()
      .from(dbSchemas.users)
      .leftJoin(
        dbSchemas.profiles,
        eq(dbSchemas.users.id, dbSchemas.profiles.userId),
      )
      .where(eq(dbSchemas.users.id, id));

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    const { users, profiles } = result;

    const user = {
      ...users,
      profile: profiles,
    };

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const [user] = await this.db
      .update(dbSchemas.users)
      .set(updateUserDto)
      .where(eq(dbSchemas.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(dbSchemas.users)
      .where(eq(dbSchemas.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    return user;
  }
}
