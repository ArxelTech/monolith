import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentDto } from 'src/event/DTO/CommentDto';
import { DateTime } from 'luxon';

@Injectable()
export class CommentsService {
  constructor(private databaseService: DatabaseService) {}

  async addComment(payload: CommentDto) {
    const user = await this.databaseService.comment.findUnique({
      where: { id: payload.userId },
    });

    const event = await this.databaseService.event.findUnique({
      where: { id: payload.eventId },
    });

    const now = DateTime.now();
    const eventDate = DateTime.fromJSDate(event.date);

    if (now < eventDate) {
      return {
        message: 'You can start a discussion now, the event has not started',
      };
    }

    if (!user) throw new BadRequestException('User not found');
    if (!event) throw new BadRequestException('Event not found');

    await this.databaseService.comment.create({
      data: payload,
    });

    return {
      message: 'Comment added',
    };
  }
}
