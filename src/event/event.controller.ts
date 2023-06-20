import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './services/event/event.service';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateEventDto } from './DTO/CreateEventDto';
import { CommentDto } from './DTO/CommentDto';
import { TicketsService } from './services/tickets/tickets.service';
import { EditTicketDto } from './DTO/EditTicketDto';
import { BuyTicketDto } from './DTO/BuyTicketDto';
import { AddTicketDto } from './DTO/AddTicketDto';

@ApiTags('EVENT')
@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private ticketService: TicketsService,
  ) {}

  @ApiParam({ name: 'eventId' })
  @Get(':eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @ApiParam({ name: 'userId' })
  @Get('user-events/:userId')
  getEventByUserId(@Param('userId') userId: string) {
    return this.eventService.getEventByUserId(userId);
  }

  @ApiBody({ type: CreateEventDto })
  @Post('create')
  createEvent(@Body() eventDetails: CreateEventDto) {
    return this.eventService.createEvent(eventDetails);
  }

  @ApiBody({ type: CommentDto })
  @Post('comment')
  commentonEvent(@Body() commenttDetails: CommentDto) {
    return this.eventService.comment(commenttDetails);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bannerImage: { type: 'string', format: 'binary' },
        pictures: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'pictures', maxCount: 5 },
      ],
      { dest: 'public/uploads' },
    ),
  )
  @Put('upload-images/:eventId')
  uploadImages(
    @Param('eventId') eventId: string,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
    },
  ) {
    return this.eventService.uploadEventImage(eventId, files);
  }

  // TICKETS SECTION

  @ApiBody({ type: BuyTicketDto })
  @Post('ticket/buy')
  createTicket(@Body() body: BuyTicketDto) {
    return this.ticketService.buyTicket(body);
  }

  @ApiQuery({ name: 'eventId', allowEmptyValue: true })
  @ApiQuery({ name: 'userId', allowEmptyValue: true })
  @Get('ticket/get-purchases/event|user?eventId=:eventId&userId=:userId')
  getTicketPurchases(@Query() query: { eventId: string; userId: string }) {
    console.log(query);
    return this.ticketService.getAllTickets(query);
  }

  @ApiParam({ name: 'ticketId' })
  @Get('ticket/:ticketId')
  getTicketById(@Param('ticketId') id: string) {
    return this.ticketService.getTicketById(id);
  }

  @ApiBody({ type: EditTicketDto })
  @Put('ticket/update')
  updateTicketPurchases(@Body() body: EditTicketDto) {
    return this.ticketService.editTicket(body);
  }

  @ApiBody({ type: AddTicketDto })
  @Put('ticket/add-more')
  addMoretickets(@Body() body: AddTicketDto) {
    return this.ticketService.addMoreTicket(body);
  }

  @ApiParam({ name: 'ticketId' })
  @Delete('ticket/:ticketId')
  deleteTicketPurchases(@Param('ticketId') ticketId: string) {
    return this.ticketService.deleteTicket(ticketId);
  }
}
