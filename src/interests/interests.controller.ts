import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDTO } from './DTO/Create.interest.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReadInterestsDTO } from './DTO/read.interests.dto';
import { AddInterestDto } from './DTO/addinterest.dto';

@ApiTags('INTERESTS')
@Controller('Interests')
export class InterestsController {
  constructor(private interestService: InterestsService) {}

  @ApiBody({ type: CreateInterestDTO })
  @Post('create')
  async createService(@Body() body: CreateInterestDTO) {
    return this.interestService.createInterest(body);
  }

  @ApiBody({ type: AddInterestDto })
  @Put('user/update')
  async updateInterests(@Body() body: AddInterestDto) {
    return this.interestService.addInterest(body);
  }

  @ApiOkResponse({ type: ReadInterestsDTO })
  @Get('')
  async getService() {
    return this.interestService.getInterest();
  }
}
