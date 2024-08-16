import { Tag } from '../user/models';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  tag: Tag;
  price: number;
  total_units: number;
  available_units: number;
  total_minted: number;
  created_at: string;
};

export type ListTicketsResponse = Ticket[];

export type TicketCheckoutPayload = {
  payer: PayerInfo;
  payer_is_attendee: boolean;
  attendees: Attendee[];
};

type PayerInfo = {
  fullname: string;
  email_address: string;
};

type Attendee = {
  email_address: string;
  ticket_id: string;
};
