import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { dbSchemas } from '../../database/schemas';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { CreateEnrollment } from './enrollments.schema';
import { ERROR_MESSAGES } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  METADATA_CONSTRUCTOR,
  PAGINATION_CONSTRUCTOR,
} from '../../common/utils/pagination';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async enroll(createEnrollmentDto: CreateEnrollment) {
    await this.db.insert(dbSchemas.enrollments).values(createEnrollmentDto);
    return { message: 'Enrolled successfully.' };
  }

  async unEnroll(userId: number, courseId: number) {
    const [deleted] = await this.db
      .delete(dbSchemas.enrollments)
      .where(
        and(
          eq(dbSchemas.enrollments.userId, userId),
          eq(dbSchemas.enrollments.courseId, courseId),
        ),
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Enrollment'));
    }

    return { message: 'Unenrolled successfully.' };
  }

  async findUserCourses(userId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const baseQuery = this.db
      .select({
        id: dbSchemas.courses.id,
        title: dbSchemas.courses.title,
        description: dbSchemas.courses.description,
        createdAt: dbSchemas.courses.createdAt,
        updatedAt: dbSchemas.courses.updatedAt,
      })
      .from(dbSchemas.enrollments)
      .innerJoin(
        dbSchemas.courses,
        eq(dbSchemas.enrollments.courseId, dbSchemas.courses.id),
      )
      .where(eq(dbSchemas.enrollments.userId, userId))
      .$dynamic();

    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db
        .select({ value: count() })
        .from(dbSchemas.enrollments)
        .innerJoin(
          dbSchemas.courses,
          eq(dbSchemas.enrollments.courseId, dbSchemas.courses.id),
        )
        .where(eq(dbSchemas.enrollments.userId, userId)),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    return { items, meta };
  }

  async findCourseStudents(courseId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const baseQuery = this.db
      .select({
        id: dbSchemas.users.id,
        name: dbSchemas.users.name,
        email: dbSchemas.users.email,
        createdAt: dbSchemas.users.createdAt,
        updatedAt: dbSchemas.users.updatedAt,
      })
      .from(dbSchemas.enrollments)
      .innerJoin(
        dbSchemas.users,
        eq(dbSchemas.enrollments.userId, dbSchemas.users.id),
      )
      .where(eq(dbSchemas.enrollments.courseId, courseId))
      .$dynamic();

    const paginatedQuery = PAGINATION_CONSTRUCTOR(baseQuery, page, limit);

    const [items, totalResult] = await Promise.all([
      paginatedQuery,
      this.db
        .select({ value: count() })
        .from(dbSchemas.enrollments)
        .innerJoin(
          dbSchemas.users,
          eq(dbSchemas.enrollments.userId, dbSchemas.users.id),
        )
        .where(eq(dbSchemas.enrollments.courseId, courseId)),
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const meta = METADATA_CONSTRUCTOR(page, limit, totalItems, items.length);

    return { items, meta };
  }
}
