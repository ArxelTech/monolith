import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddTicketDto } from 'src/event/DTO/AddTicketDto';
import { BuyTicketDto } from 'src/event/DTO/BuyTicketDto';

@Injectable()
export class TicketsService {
  constructor(private databaseService: DatabaseService) {}

  /**
+   * Asynchronously buys a ticket, and returns a message indicating success
+   * or failure. Throws a BadRequestException if the ticket is invalid or sold
+   * out.
+   *
+   * @param {BuyTicketDto} payload - An object containing the ticket ID, user ID,
+   * transaction ID, quantity, and event ID.
+   * @return {Object} An object containing a success message, and data on the
+   * new ticket purchase if successful.
+   */
  async buyTicket(payload: BuyTicketDto) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (!ticket) throw new BadRequestException('Invalid ticket');

    if (!ticket.isFree) {
      return {
        message: 'You can buy this ticket now',
      };
    }

    if (payload.quantity > ticket.quantity) {
      throw new BadRequestException('Ticket soldout');
    }

    // create ticketEntry
    const newTickettPurchase = await this.databaseService.ticketPurchase.create(
      {
        data: {
          ticketId: payload.ticketId,
          userId: payload.userId,
          transactionId: payload.transactionId || -1,
          quantity: payload.quantity,
          eventId: ticket.eventId,
        },
      },
    );

    // update the ticket record
    await this.databaseService.ticket.update({
      where: { id: ticket.id },
      data: { quantity: ticket.quantity - payload.quantity },
    });

    // check ticket quantitty
    const updatedTicket = await this.databaseService.ticket.findUnique({
      where: { id: ticket.id },
    });

    if (updatedTicket.quantity < 10) {
      //TODO update user to add more tickets
    }

    // TODO send mail of the ticket details

    return {
      message: `You have bought a ticket`,
      data: newTickettPurchase,
    };
  }

  /**
+   * Asynchronously adds more tickets to a given ticket's quantity.
+   *
+   * @param {AddTicketDto} payload - An object containing the ticket's id and the quantity to add.
+   * @throws {BadRequestException} - If the ticket is not found.
+   * @return {Object} - An object containing a message indicating the updated ticket quantity.
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

  /**
+   * Retrieves all ticket purchases made by a specific user.
+   *
+   * @param {string} userId - The ID of the user whose ticket purchases are being retrieved.
+   * @return {Promise<{message: string, data: TicketPurchase[]}>} - A Promise that resolves to an object containing
+   * a message and an array of TicketPurchase objects representing the user's ticket purchases.
+   */
  async getAllTicketPurchaseByUserId(userId: string) {
    const tickets = await this.databaseService.ticketPurchase.findMany({
      where: { userId },
      include: {
        event: true,
      },
    });

    return {
      message: 'Purchased tickets',
      data: tickets,
    };
  }

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * Retrieves all purchases for a given event ID, including user information.
+   *
+   * @param {string} eventId - the ID of the event to retrieve purchases for
+   * @return {Promise<{message: string, data: object[]}>} - a promise that resolves to an object containing a message and an array of purchase data 
+   */
  async getAllPurchaseForAnEvent(eventId: string) {
    const tickets = await this.databaseService.ticketPurchase.findMany({
      where: { eventId },
      include: {
        user: true,
      },
    });

    return {
      message: `ticket purchase`,
      data: tickets,
    };
  }

  // <<<<<<<<<<<<<  ✨ Codeium AI Suggestion  >>>>>>>>>>>>>>
  /**
+   * Deletes a ticket if it has no purchases.
+   *
+   * @param {string} ticketId - the id of the ticket to delete
+   * @throws {BadRequestException} if the ticket has a purchase
+   * @return {Promise<{message: string}>} a promise that resolves to an object
+   * containing a success message
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
}
