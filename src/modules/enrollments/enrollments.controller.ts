import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@ApiTags('Enrollment')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('/enroll')
  @ApiOperation({ summary: 'Enroll student in a course.' })
  async enroll(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.enroll(createEnrollmentDto);
  }

  @Delete('/un-enroll/:userId/:courseId')
  @ApiOperation({ summary: 'Un-Enroll student from a course.' })
  async unEnroll(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.unEnroll(userId, courseId);
  }

  @Get('/user-courses/:userId')
  @ApiOperation({ summary: 'Find courses of a user by userId.' })
  async findUserCourses(@Param('userId', ParseIntPipe) userId: number) {
    return this.enrollmentsService.findUserCourses(userId);
  }

  @Get('/course-students/:courseId')
  @ApiOperation({ summary: 'Find students of a course by courseId.' })
  async findCourseStudents(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findCourseStudents(courseId);
  }
}
