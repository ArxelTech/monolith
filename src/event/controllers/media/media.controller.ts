import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MediaService } from 'src/event/services/media/media.service';

@ApiTags('MEDIA')
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Put('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'for the media, you can upload several files with the same name media',
    schema: {
      type: 'object',
      properties: {
        media: { type: 'string', format: 'binary' },
        eventId: { type: 'string', format: 'string' },
        userId: { type: 'string', format: 'string' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('media', 5, { dest: 'public/media' }))
  upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { userId: string; eventId: string },
  ) {
    return this.mediaService.addMedia(body, files);
  }

  @Get('media/uploaded-by-user/:userId')
  getUserUploadedMedia(@Param('userId') userId: string) {
    return this.mediaService.getUserUploadedMedia(userId);
  }

  @Get('media/:eventId')
  getEventUploadedMedia(@Param('eventId') eventId: string) {
    return this.mediaService.geteventUploadedMedia(eventId);
  }

  @Delete(':id')
  deletePicture(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }
}
