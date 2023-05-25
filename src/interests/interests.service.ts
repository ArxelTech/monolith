import { DatabaseService, Interestcreateable } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class InterestsService {
  constructor(private databaseService: DatabaseService) {}

  async getServices() {
    const data = await this.databaseService.interest.findMany();

    return {
      data,
    };
  }

  async createService(data: Interestcreateable) {
    const exist = await this.databaseService.interest.findMany({
      where: { interest: data.interest.toLowerCase() },
    });

    if (!exist.length) {
      throw new BadRequestException('Interest already exist');
    }
    return this.databaseService.interest.create({
      data: {
        interest: data.interest.toLowerCase(),
      },
    });
  }
}
