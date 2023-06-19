import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentDto } from 'src/event/DTO/CommentDto';
import { CreateEventDto } from 'src/event/DTO/CreateEventDto';
import Cloudinary from 'src/utils/cloudinary';
import { Comment } from '@prisma/client';
@Injectable()
export class EventService {
  constructor(private databaseService: DatabaseService) {}

  /**
+   * Creates an event with the given data and files.
+   *
+   * @param {CreateEventDto} event - The event data to create.
+   * @param {Object} files - The files to be uploaded.
+   * @param {Express.Multer.File[]} [files.bannerImage] - The banner image files.
+   * @param {Express.Multer.File[]} [files.pictures] - The picture files.
+   * @returns {Promise<{ message: string, data: any }>} - The message and data of the created event.
+   */
  async createEvent(event: CreateEventDto) {
    const tickets = event.tickets;
    delete event.tickets;

    const newEvent = await this.databaseService.event.create({
      data: {
        userId: event.userId,
        address: event.address,
        date: event.date,
        description: event.description,
        lga: event.lga,
        state: event.state,
        title: event.title,
        videoUrl: event.videoUrl,
        eventType: event.eventType,
        people: event.people,
        isDraft: event.isDraft,
        time: event.time,
        isLiveEvent: event.isLiveEvent,
        hasTickets: event.hasTickets,
        isPrivate: event.isPrivate,
      },
    });

    // create tickets
    if (tickets && tickets.length > 0) {
      await Promise.all(
        tickets.map(async (tick) => {
          await this.databaseService.ticket.create({
            data: {
              eventId: newEvent.id,
              ticketName: tick.ticketName,
              price: tick.price,
              quantity: tick.quantity,
              description: tick.description,
              isFree: tick.isFree,
              isUnlimited: tick.isUnlimited,
            },
          });
        }),
      );
    }

    return {
      message: event.isDraft
        ? 'Event created an saved as drafts'
        : 'Event created successfully',
      data: { ...newEvent },
    };
  }

  async uploadEventImage(
    eventId: string,
    files: {
      bannerImage?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
    },
  ) {
    const event = await this.databaseService.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    if (event.bannerImage || event.pictures.length > 0) {
      return {
        message: 'Images already uploaded, u can added extra images later',
      };
    }
    // upload the banner images
    const bannerImage = await Promise.all(
      files.bannerImage.map(async (item) => {
        const secureUpload = await Cloudinary.uploader.upload(item.path);
        return secureUpload.secure_url;
      }),
    );

    // upload the pictures
    const pictures = await Promise.all(
      files.pictures.map(async (item) => {
        const secureUpload = await Cloudinary.uploader.upload(item.path);
        return secureUpload.secure_url;
      }),
    );

    const updatedEvent = await this.databaseService.event.update({
      where: { id: eventId },
      data: {
        bannerImage: bannerImage[0],
        pictures,
      },
    });

    console.log(updatedEvent);

    return {
      message: 'Uploaded images',
    };
  }

  /**
+   * Retrieves an event by its unique identifier from the database, including tickets,
+   * comments, pictures, ticket purchases, and user information.
+   *
+   * @param {string} eventId - The unique identifier of the event to retrieve.
+   * @return {Promise<{message: string, data: any}>} An object containing a message indicating
+   * that the event was found and the retrieved event data.
+   * @throws {BadRequestException} If the event was not found in the database.
+   */
  async getEventById(eventId: string) {
    const event = await this.databaseService.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        Comment: true,
        Picture: true,
        TicketPurchase: true,
        user: true,
      },
    });

    if (event === null || event === undefined)
      throw new BadRequestException('Event not found');
    return {
      message: 'event found',
      data: event,
    };
  }

  /**
+   * Retrieves an event by the user ID asynchronously.
+   *
+   * @param {string} userId - The ID of the user.
+   * @return {Promise<{data: any}>} - Returns a promise that resolves with an
+   * object containing the retrieved event data.
+   */
  async getEventByUserId(userId: string) {
    const event = await this.databaseService.event.findMany({
      where: { userId },
      include: {
        tickets: true,
        Comment: true,
        Picture: true,
        TicketPurchase: true,
        user: true,
      },
    });

    return {
      data: event,
    };
  }

  /**
+ * Asynchronously adds a new comment to the database with the given payload.
+ *
+ * @param {CommentDto} payload - The data to create the new comment.
+ * @return {Promise<{ message: string, data: Comment }>} - A Promise that resolves to an object containing a success message and the newly created Comment object.
+ * @throws {BadRequestException} - If the user or event specified in the payload do not exist in the database.
+ */
  async comment(
    payload: CommentDto,
  ): Promise<{ message: string; data: Comment }> {
    const event = await this.databaseService.event.findUnique({
      where: { id: payload.eventId },
    });

    const user = await this.databaseService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new BadRequestException('User not found');

    if (!event) throw new BadRequestException('Event not found');

    const newComment = await this.databaseService.comment.create({
      data: { ...payload },
    });

    return {
      message: 'comment added',
      data: newComment,
    };
  }
}
