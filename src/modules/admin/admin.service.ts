import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { asc, count, desc, eq, notExists, sql } from 'drizzle-orm';
import { dbSchemas } from '../../database/schemas';
import { DATABASE_CONNECTION } from '../../database/database-connection';

@Injectable()
export class AdminService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof dbSchemas>,
  ) {}

  async findStats() {
    const stats = await this.db.execute(sql`
        SELECT
            (SELECT COUNT(*)::INT FROM users) AS users,
            (SELECT COUNT(*)::INT FROM courses) AS courses,
            (SELECT COUNT(*)::INT FROM lessons) AS lessons,
            (SELECT COUNT(*)::INT FROM enrollments) AS enrollments
    `);

    return stats['rows'][0];
  }

  async findTopInstructors() {
    const result = await this.db.execute(sql`
        WITH course_counts AS (
            SELECT
                c.instructor_id,
                COUNT(*)::INT AS total_courses
            FROM courses AS c
            GROUP BY c.instructor_id
        ), enrollment_counts AS (
            SELECT
                c.instructor_id,
                COUNT(e.user_id)::INT AS total_enrollments
            FROM courses AS c
            LEFT JOIN enrollments AS e ON e.course_id = c.id
            GROUP BY c.instructor_id
        )
        SELECT
            u.id,
            u.name,
            cc.total_courses AS "totalCourses",
            COALESCE(ec.total_enrollments, 0) AS "totalEnrollments"
        FROM users AS u
        INNER JOIN course_counts AS cc ON cc.instructor_id = u.id
        LEFT JOIN enrollment_counts AS ec ON ec.instructor_id = u.id
        ORDER BY ec.total_enrollments DESC
    `);

    return result['rows'];
  }

  async findPopularCourses() {
    const totalEnrollments = count(dbSchemas.enrollments.userId);

    const courses = await this.db
      .select({
        id: dbSchemas.courses.id,
        title: dbSchemas.courses.title,
        totalEnrollments,
      })
      .from(dbSchemas.courses)
      .leftJoin(
        dbSchemas.enrollments,
        eq(dbSchemas.enrollments.courseId, dbSchemas.courses.id),
      )
      .groupBy(dbSchemas.courses.id, dbSchemas.courses.title)
      .orderBy(desc(totalEnrollments));

    return courses;
  }

  async findDailyEnrollments() {
    const date = sql<Date>`DATE(${dbSchemas.enrollments.enrolledAt})`;
    const totalEnrollments = count(dbSchemas.enrollments.userId);

    const dailyEnrollments = await this.db
      .select({ date, totalEnrollments })
      .from(dbSchemas.enrollments)
      .groupBy(date)
      .orderBy(asc(date));

    return dailyEnrollments;
  }

  async findCoursesWithNoEnrollments() {
    const subQuery = this.db
      .select({ id: dbSchemas.enrollments.courseId })
      .from(dbSchemas.enrollments)
      .where(eq(dbSchemas.enrollments.courseId, dbSchemas.courses.id));

    const courses = await this.db
      .select({
        id: dbSchemas.courses.id,
        title: dbSchemas.courses.title,
      })
      .from(dbSchemas.courses)
      .where(notExists(subQuery))
      .orderBy(dbSchemas.courses.title);

    return courses;
  }

  async findUserRankings() {
    const rankings = await this.db.execute(sql`
        WITH user_enrollments AS (
            SELECT
                u.id,
                u.name,
                COUNT(e.user_id)::INT AS total_enrollments
            FROM users AS u
            LEFT JOIN enrollments AS e ON e.user_id = u.id
            GROUP BY u.id, u.name
        )
        SELECT
            id,
            name,
            total_enrollments AS "totalEnrollments",
            RANK() OVER (
                ORDER BY total_enrollments DESC
            )::INT AS ranking
        FROM user_enrollments
    `);

    return rankings['rows'];
  }
}
