import { DatabaseService, Interestcreateable } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddInterestDto } from './DTO/addinterest.dto';

@Injectable()
export class InterestsService {
  constructor(private databaseService: DatabaseService) {}

  async getInterest() {
    const data = await this.databaseService.interest.findMany();

    return {
      data,
    };
  }

  async createInterest(data: Interestcreateable) {
    const exist = await this.databaseService.interest.findMany({
      where: { interest: data.interest.toLowerCase() },
    });

    if (exist.length) {
      throw new BadRequestException('Interest already exist');
    }
    return this.databaseService.interest.create({
      data: {
        interest: data.interest.toLowerCase(),
      },
    });
  }

  async addInterest(payload: AddInterestDto) {
    console.log(payload);
    const exist = await this.databaseService.user.findFirst({
      where: { id: payload.userId },
    });
    if (!exist) {
      throw new BadRequestException('User not found');
    }

    const newInterests = payload.interests.filter(
      (interest) => !exist.interests.includes(interest),
    );
    exist.interests.push(...newInterests);
    await Promise.all(
      newInterests.map((interest) =>
        this.databaseService.user.update({
          where: { id: payload.userId },
          data: { interests: { push: interest } },
        }),
      ),
    );

    return {
      message: 'Interets updated',
    };
  }
}

// Improved Code:
// - Use Promise.all() in the addInterest method to update all interests in parallel instead of using a for loop.
