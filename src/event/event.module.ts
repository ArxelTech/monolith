import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './services/event/event.service';
import { TicketsService } from './services/tickets/tickets.service';
import { DatabaseModule } from '@app/database';
import { CommentController } from './controllers/comment/comment.controller';
import { MediaController } from './controllers/media/media.controller';
import { MediaService } from './services/media/media.service';
import { CommentsService } from './services/comments/comments.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController, CommentController, MediaController],
  providers: [EventService, TicketsService, MediaService, CommentsService],
})
export class EventModule {}
