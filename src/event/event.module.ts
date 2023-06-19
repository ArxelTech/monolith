import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './services/event/event.service';
import { TicketsService } from './services/tickets/tickets.service';
import { PicturesService } from './services/pictures/pictures.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [EventService, TicketsService, PicturesService],
})
export class EventModule {}
