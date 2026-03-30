import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post(':userId')
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.profilesService.create(userId, createProfileDto);
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.findOne(userId);
  }
}
