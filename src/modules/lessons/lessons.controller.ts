import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Lesson')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('/courses/:courseId')
  @ApiOperation({ summary: 'Get list of all lessons for a course' })
  async find(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.lessonsService.find(courseId, paginationDto);
  }

  @Get(':lessonId')
  @ApiOperation({ summary: 'Get single lesson details by ID' })
  async findOne(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.lessonsService.findOne(lessonId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson for a course' })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Patch(':lessonId')
  @ApiOperation({ summary: 'Update lesson details by ID' })
  async update(
    @Body() updateLessonDto: UpdateLessonDto,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    return this.lessonsService.update(lessonId, updateLessonDto);
  }

  @Delete(':lessonId')
  @ApiOperation({ summary: 'Delete a single lesson by ID' })
  async remove(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.lessonsService.remove(lessonId);
  }
}
