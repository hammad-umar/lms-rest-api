import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';
import { ZodResponse } from 'nestjs-zod';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create user profile' })
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.profilesService.create(userId, createProfileDto);
  }

  @Get(':userId')
  @ZodResponse({ type: ProfileResponseDto, status: HttpStatus.OK })
  @ApiOperation({ summary: 'Find user profile by user ID' })
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.findOne(userId);
  }
}
