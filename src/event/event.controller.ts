import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './services/event/event.service';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateEventDto } from './DTO/CreateEventDto';
import { CommentDto } from './DTO/CommentDto';

@ApiTags('EVENT')
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

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
      { dest: './uploads' },
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
}
