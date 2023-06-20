import { DatabaseService } from '@app/database';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AddTicketDto } from 'src/event/DTO/AddTicketDto';
import { BuyTicketDto } from 'src/event/DTO/BuyTicketDto';
import { EditTicketDto } from 'src/event/DTO/EditTicketDto';

@Injectable()
export class TicketsService {
  constructor(private databaseService: DatabaseService) {}

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * This function buys a ticket for the user and updates the ticket and user details in the database.
+   * 
+   * @async
+   * @param {BuyTicketDto} payload - An object containing the payload for buying a ticket
+   * @param {string} payload.ticketId - ID of the ticket to be purchased
+   * @param {string} payload.userId - ID of the user who is buying the ticket
+   * @param {string} payload.transactionId - ID of the transaction for the purchase
+   * @param {number} payload.quantity - Quantity of tickets to be purchased
+   * @returns {Object} Object containing a message and data of the ticket purchase
+   * @throws {BadRequestException} If the ticket is invalid or sold out
+   * @throws {InternalServerErrorException} If there is an error during the transaction
+   */
  async buyTicket(payload: BuyTicketDto) {
    try {
      let result;

      await this.databaseService.$transaction<any>(async (transaction) => {
        const ticket = await transaction.ticket.findUnique({
          where: { id: payload.ticketId },
        });

        if (!ticket) throw new BadRequestException('Invalid ticket');

        if (!ticket.isFree) {
          result = {
            message: 'You cannot buy this ticket now',
          };
          return;
        }

        if (payload.quantity > ticket.quantity) {
          throw new BadRequestException('Ticket soldout');
        }

        const newTicketPurchase = await transaction.ticketPurchase.create({
          data: {
            ticketId: payload.ticketId,
            userId: payload.userId,
            transactionId: payload.transactionId || -1,
            quantity: payload.quantity,
            eventId: ticket.eventId,
          },
        });

        await transaction.ticket.update({
          where: { id: ticket.id },
          data: { quantity: ticket.quantity - payload.quantity },
        });

        const updatedTicket = await transaction.ticket.findUnique({
          where: { id: ticket.id },
        });

        if (updatedTicket.quantity < 10) {
          //TODO update user to add more tickets
          console.log(`Ticket quantity deplited`);
        }

        // TODO send mail of the ticket details

        result = {
          message: `You have bought a ticket`,
          data: newTicketPurchase,
        };
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message, error);
      // handle error and rollback transaction if needed
    }
  }

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * Asynchronously adds more tickets to the database given a valid ticket id and quantity.
+   *
+   * @param {AddTicketDto} payload - An object containing the ticket id and quantity to add.
+   * @throws {BadRequestException} - If the ticket is not found.
+   * @return {Object} - An object containing a message with the new ticket quantity.
+   */
  async addMoreTicket(payload: AddTicketDto) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (!ticket) throw new BadRequestException('Ticket not found');

    await this.databaseService.ticket.update({
      where: { id: ticket.id },
      data: { quantity: ticket.quantity + payload.quantity },
    });

    return {
      message: `Ticket quantity updated to ${
        ticket.quantity + payload.quantity
      }`,
    };
  }

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * Retrieves all tickets based on optional filters for user and event.
+   *
+   * @param {Object} [filter] - Optional object containing userId and/or eventId filters.
+   * @param {string} [filter.userId] - The ID of the user to filter tickets by.
+   * @param {string} [filter.eventId] - The ID of the event to filter tickets by.
+   * @return {Object} Object containing a message and the retrieved tickets data.
+   */
  async getAllTickets(filter?: { userId?: string; eventId?: string }) {
    let where = {};

    if (filter?.userId) {
      where = { ...where, userId: filter.userId };
    }

    if (filter?.eventId) {
      where = { ...where, eventId: filter.eventId };
    }

    const tickets = await this.databaseService.ticketPurchase.findMany({
      where,
      include: {
        event: filter.userId ? true : false,
        user: filter.eventId ? true : false,
      },
    });

    return {
      message: 'Purchased tickets',
      data: tickets,
    };
  }

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * Retrieves a ticket from the database by the given ID.
+   *
+   * @param {string} id - The ID of the ticket to retrieve.
+   * @return {Promise<{message: string, data: Ticket}>} - A Promise that resolves with an object
+   * containing a success message and the retrieved ticket data.
+   * @throws {BadRequestException} - If the ticket with the given ID is not found.
+   */
  async getTicketById(id: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!ticket) throw new BadRequestException('Ticket not found');
    return {
      message: 'ticket found',
      data: ticket,
    };
  }

  /**
+   * Deletes a ticket by ID, if it is not associated with a purchase.
+   *
+   * @param {string} ticketId - The ID of the ticket to be deleted.
+   * @return {Object} An object containing a message indicating the ticket was deleted.
+   *                  {string} message - The message confirming the ticket was deleted.
+   * @throws {BadRequestException} If the ticket is associated with a purchase.
+   */
  async deleteTicket(ticketId: string) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id: ticketId },
      include: {
        TicketPurchase: true,
      },
    });
    if (ticket.TicketPurchase.length > 0) {
      throw new BadRequestException(
        `You can't delete a ticket that has a purchase.`,
      );
    }
    await this.databaseService.ticket.delete({ where: { id: ticketId } });
    return {
      message: `Ticket with name ${ticket.ticketName} deleted`,
    };
  }

  /**
+   * Asynchronously edits a ticket and returns a message indicating success and the updated ticket.
+   *
+   * @param {EditTicketDto} payload - An object containing the ticket ID and any fields to update.
+   * @return {Promise<{ message: string, data: any }>} - An object containing a success message and the updated ticket.
+   * @throws {BadRequestException} - If the ticket ID cannot be found in the database.
+   */
  async editTicket(payload: EditTicketDto) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (!ticket) throw new BadRequestException('Ticket not found');

    const newUpdate = await this.databaseService.ticket.update({
      where: { id: ticket.id },
      data: {
        quantity: payload.quantity ?? ticket.quantity,
        ticketName: payload.ticketName ?? ticket.ticketName,
        description: payload.description ?? ticket.description,
        isFree: payload.isFree ?? ticket.isFree,
        price: payload.price ?? ticket.price,
      },
    });
    return {
      message: 'Ticket updated',
      data: newUpdate,
    };
  }
}
