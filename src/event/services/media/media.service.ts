import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import Cloudinary from 'src/utils/cloudinary';

@Injectable()
export class MediaService {
  constructor(private databaseService: DatabaseService) {}

  async addMedia(
    payload: { userId: string; eventId: string },
    files: Array<Express.Multer.File>,
  ) {
    const event = await this.databaseService.event.findUnique({
      where: { id: payload.eventId },
    });

    if (!event) throw new BadRequestException('Event not found');

    if (files.length < 1) {
      return {
        message: 'No media uploaded',
      };
    }

    const media = await this.UploadFilesToCloudinarry(files);

    // save in the database
    console.log(media);
    await this.databaseService.picture.create({
      data: {
        eventId: payload.eventId,
        userId: payload.userId,
        isFree: true,
        price: 0,
        images: media,
        approved: payload.userId === event.userId ? true : false,
      },
    });

    return {
      message: 'Media uploaded',
    };
  }

  async getUserUploadedMedia(userId: string) {
    const medias = await this.databaseService.picture.findMany({
      where: { userId },
    });

    return {
      data: medias,
    };
  }

  async geteventUploadedMedia(eventId: string) {
    const medias = await this.databaseService.picture.findMany({
      where: { eventId },
    });

    return {
      data: medias,
    };
  }

  private async UploadFilesToCloudinarry(files: Array<Express.Multer.File>) {
    console.log(files);
    const media = await Promise.all(
      files.map(async (item) => {
        try {
          const newMedia = await Cloudinary.uploader.upload(item.path, {
            async: false,
            chunk_size: 1000,
            format: item.mimetype.split('/')[1],
            quality_analysis: true,
            unique_filename: true,
            transformation: {
              width: '1080',
              height: '1350',
              aspect_ratio: '4:5',
            },
          });
          return newMedia.secure_url;
        } catch (error) {
          throw new BadRequestException(error);
        }
      }),
    );
    return media;
  }

  async deleteMedia(id: string) {
    await this.databaseService.picture.delete({
      where: { id },
    });

    return {
      message: 'Media deleted',
    };
  }
}
