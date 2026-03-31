import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { dbSchemas } from '../../database/schemas';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { CreateEnrollment } from './enrollments.schema';
import { ERROR_MESSAGES } from '../../common/constants';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async enroll(createEnrollmentDto: CreateEnrollment) {
    try {
      await this.db.insert(dbSchemas.enrollments).values(createEnrollmentDto);
      return { message: 'Enrolled successfully.' };
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'cause' in err) {
        const cause = (err as { cause?: unknown }).cause;

        if (cause instanceof DatabaseError) {
          if (
            cause.code === '23505' &&
            cause.constraint === 'enrollments_user_id_course_id_pk'
          ) {
            throw new BadRequestException(
              'User is already enrolled in this course.',
            );
          }

          if (cause.code === '23503') {
            throw new BadRequestException('Invalid user or course.');
          }
        }
      }

      throw err;
    }
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

  async findUserCourses(userId: number) {
    const courses = await this.db
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
      .where(eq(dbSchemas.enrollments.userId, userId));

    return courses;
  }

  async findCourseStudents(courseId: number) {
    const students = await this.db
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
      .where(eq(dbSchemas.enrollments.courseId, courseId));

    return students;
  }
}
