import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import * as usersSchema from '../../database/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

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
      throw new UnprocessableEntityException('Email already exists.');
    }

    const [user] = await this.db
      .insert(usersSchema.users)
      .values(createUserDto)
      .returning();

    return user;
  }

  async find() {
    return this.db.query.users.findMany();
  }

  async findOne(id: number) {
    const [user] = await this.db
      .select()
      .from(usersSchema.users)
      .where(eq(usersSchema.users.id, id));

    if (!user) {
      throw new NotFoundException('User not found.');
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
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(usersSchema.users)
      .where(eq(usersSchema.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
