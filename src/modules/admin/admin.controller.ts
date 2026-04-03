import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/stats')
  @ApiOperation({ summary: 'Find statistics' })
  async findStats() {
    return this.adminService.findStats();
  }

  @Get('/top-instructors')
  @ApiOperation({ summary: 'Find top instructors' })
  async findTopInstructors() {
    return this.adminService.findTopInstructors();
  }

  @Get('/popular-courses')
  @ApiOperation({ summary: 'Find popular courses' })
  async findPopularCourses() {
    return this.adminService.findPopularCourses();
  }

  @Get('/daily-enrollments')
  @ApiOperation({ summary: 'Find daily enrollments' })
  async findDailyEnrollments() {
    return this.adminService.findDailyEnrollments();
  }

  @Get('/empty-courses')
  @ApiOperation({ summary: 'Find courses with no enrollments' })
  async findCoursesWithNoEnrollments() {
    return this.adminService.findCoursesWithNoEnrollments();
  }

  @Get('/user-rankings')
  @ApiOperation({ summary: 'Find user rankings' })
  async findUserRankings() {
    return this.adminService.findUserRankings();
  }
}
