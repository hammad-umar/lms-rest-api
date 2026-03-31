import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Course')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Find all courses list' })
  async find() {
    return this.coursesService.find();
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Find course details by ID' })
  async findOne(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.findOne(courseId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':courseId')
  @ApiOperation({ summary: 'Update course details by ID' })
  async update(
    @Body() updateCourseDto: UpdateCourseDto,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.coursesService.update(courseId, updateCourseDto);
  }

  @Delete(':courseId')
  @ApiOperation({ summary: 'Remove course by ID' })
  async remove(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.remove(courseId);
  }
}
