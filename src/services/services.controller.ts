import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDTO } from './DTO/Create.service.dto';
import { ReadServicesDTO } from './DTO/read.services.dto';

@ApiTags('SERVICES')
@Controller('services')
export class ServicesController {
  constructor(private services: ServicesService) {}

  @ApiBody({ type: CreateServiceDTO })
  @Post('create')
  async createService(@Body() body: CreateServiceDTO) {
    return this.services.createService(body);
  }

  @ApiOkResponse({ type: ReadServicesDTO })
  @Get('')
  async getService() {
    return this.services.getServices();
  }
}
