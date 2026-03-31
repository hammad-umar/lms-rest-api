import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { dbSchemas } from '../../database/schemas';
import { CreateCourseDto } from './dto/create-course.dto';
import { count, eq, sql, ilike } from 'drizzle-orm';
import { ERROR_MESSAGES } from '../../common/constants';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  METADATA_CONSTRUCTOR,
  PAGINATION_CONSTRUCTOR,
} from '../../common/utils/pagination';
import { SearchDto } from '../../common/dto/search.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { instructorId } = createCourseDto;

    const [instructor] = await this.db
      .select()
      .from(dbSchemas.users)
      .where(eq(dbSchemas.users.id, instructorId));

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Instructor'));
    }

    const [course] = await this.db
      .insert(dbSchemas.courses)
      .values(createCourseDto)
      .returning();

    return course;
  }

  async find(paginationDto: PaginationDto, searchDto: SearchDto) {
    const { page, limit } = paginationDto;
    const { searchTerm } = searchDto;

    const term = searchTerm ?? '';
    const whereClause = term
      ? ilike(sql`${dbSchemas.courses.title}`, `%${term}%`)
      : undefined;

    const baseQuery = this.db
      .select()
      .from(dbSchemas.courses)
      .where(whereClause)
      .$dynamic();

    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db
        .select({ value: count() })
        .from(dbSchemas.courses)
        .where(whereClause),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    return { items, meta };
  }

  async findOne(courseId: number) {
    const [course] = await this.db
      .select()
      .from(dbSchemas.courses)
      .where(eq(dbSchemas.courses.id, courseId));

    if (!course) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Course'));
    }

    return course;
  }

  async update(courseId: number, updateCourseDto: UpdateCourseDto) {
    const [course] = await this.db
      .select()
      .from(dbSchemas.courses)
      .where(eq(dbSchemas.courses.id, courseId));

    if (!course) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Course'));
    }

    if (updateCourseDto?.instructorId) {
      const [instructor] = await this.db
        .select()
        .from(dbSchemas.users)
        .where(eq(dbSchemas.users.id, updateCourseDto.instructorId));

      if (!instructor) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Instructor'));
      }
    }

    const updatedCourse = await this.db
      .update(dbSchemas.courses)
      .set(updateCourseDto)
      .where(eq(dbSchemas.courses.id, courseId))
      .returning();

    return updatedCourse;
  }

  async remove(courseId: number) {
    const [course] = await this.db
      .select()
      .from(dbSchemas.courses)
      .where(eq(dbSchemas.courses.id, courseId));

    if (!course) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Course'));
    }

    const [deletedCourse] = await this.db
      .delete(dbSchemas.courses)
      .where(eq(dbSchemas.courses.id, courseId))
      .returning();

    return deletedCourse;
  }
}
