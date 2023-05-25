import { Body, Controller, Get, Post } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDTO } from './DTO/Create.interest.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ReadInterestsDTO } from './DTO/read.interests.dto';

@Controller('Interests')
export class InterestsController {
  constructor(private interestService: InterestsService) {}

  @ApiBody({ type: CreateInterestDTO })
  @Post('create')
  async createService(@Body() body: CreateInterestDTO) {
    return this.interestService.createService(body);
  }

  @ApiOkResponse({ type: ReadInterestsDTO })
  @Get('')
  async getService() {
    return this.interestService.getServices();
  }
}
