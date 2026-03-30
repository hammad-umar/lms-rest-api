import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import * as usersSchema from '../../database/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  METADATA_CONSTRUCTOR,
  PAGINATION_CONSTRUCTOR,
} from '../../common/utils/pagination';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof usersSchema>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const [alreadyExists] = await this.db
      .select()
      .from(usersSchema.users)
      .where(eq(usersSchema.users.email, email));

    if (alreadyExists) {
      throw new UnprocessableEntityException(
        ERROR_MESSAGES.ALREADY_EXISTS('Email'),
      );
    }

    const [user] = await this.db
      .insert(usersSchema.users)
      .values(createUserDto)
      .returning();

    return user;
  }

  async find(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const baseQuery = this.db.select().from(usersSchema.users).$dynamic();
    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db.select({ value: count() }).from(usersSchema.users),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    return { items, meta };
  }

  async findOne(id: number) {
    const [user] = await this.db
      .select()
      .from(usersSchema.users)
      .where(eq(usersSchema.users.id, id));

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const [user] = await this.db
      .update(usersSchema.users)
      .set(updateUserDto)
      .where(eq(usersSchema.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(usersSchema.users)
      .where(eq(usersSchema.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('User'));
    }

    return user;
  }
}
