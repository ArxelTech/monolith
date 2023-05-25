import {
  DatabaseService,
  ServiceCreateable,
  ServiceUpdateable,
} from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService extends DatabaseService {
  constructor() {
    super();
  }

  async getServices() {
    const data = await this.service.findMany();

    return {
      data,
    };
  }

  async getService(id: string) {
    return this.service.findUnique({
      where: { id },
    });
  }

  async createService(data: ServiceCreateable) {
    const exist = await this.service.findMany({
      where: { service: data.service.toLowerCase() },
    });
    if (!exist.length) {
      throw new BadRequestException('already already exist');
    }
    return this.service.create({
      data: {
        service: data.service.toLowerCase(),
      },
    });
  }

  async updateService(id: string, data: ServiceUpdateable) {
    return this.service.update({
      where: { id },
      data: {
        service: data.service,
      },
    });
  }

  async deleteService(id: string) {
    return this.service.delete({
      where: { id },
    });
  }

  async getOneService(id: string) {
    return this.service.findUnique({
      where: { id },
    });
  }
}
