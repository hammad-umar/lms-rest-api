import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { dbSchemas } from '../../database/schemas';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { ERROR_MESSAGES } from '../../common/constants';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  METADATA_CONSTRUCTOR,
  PAGINATION_CONSTRUCTOR,
} from '../../common/utils/pagination';

@Injectable()
export class LessonsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async find(courseId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const baseQuery = this.db
      .select()
      .from(dbSchemas.lessons)
      .where(eq(dbSchemas.lessons.courseId, courseId))
      .$dynamic();

    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db
        .select({ value: count() })
        .from(dbSchemas.lessons)
        .where(eq(dbSchemas.lessons.courseId, courseId)),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    return { items, meta };
  }

  async findOne(lessonId: number) {
    const [lesson] = await this.db
      .select()
      .from(dbSchemas.lessons)
      .where(eq(dbSchemas.lessons.id, lessonId));

    if (!lesson) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lesson'));
    }

    return lesson;
  }

  async create(createLessonDto: CreateLessonDto) {
    const [lesson] = await this.db
      .insert(dbSchemas.lessons)
      .values(createLessonDto)
      .returning();

    return lesson;
  }

  async update(lessonId: number, updateLessonDto: UpdateLessonDto) {
    const [lesson] = await this.db
      .update(dbSchemas.lessons)
      .set(updateLessonDto)
      .where(eq(dbSchemas.lessons.id, lessonId))
      .returning();

    if (!lesson) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lesson'));
    }

    return lesson;
  }

  async remove(lessonId: number) {
    const [lesson] = await this.db
      .delete(dbSchemas.lessons)
      .where(eq(dbSchemas.lessons.id, lessonId))
      .returning();

    if (!lesson) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lesson'));
    }

    return lesson;
  }
}
