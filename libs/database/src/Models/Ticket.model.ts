export interface Ticket {
  id: string;
  eventId: string;
  ticketName: string;
  price: number;
  description: string;
  isFree: boolean;
  isUnlimited: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export type Ticketcreateabble = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type Ticketupdateable = Partial<Ticketcreateabble>;
