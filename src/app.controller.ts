import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Record<string, any> {
    return this.appService.getHello();
  }

  @ApiTags('WEBHOOK')
  @Post('webhook')
  webhook(): Record<string, any> {
    return this.appService.getHello();
  }
}
