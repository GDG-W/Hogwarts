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
  attendees:
    | {
        ticket_id: string;
        email_address: string;
      }[]
    | Attendee[];
};

type PayerInfo = {
  fullname: string;
  email_address: string;
};

type Attendee = {
  ticket_id: string;
  email_address: string;
  fullname: string;
  role: string;
  level_of_expertise: string;
};

export type TicketCheckoutResponse = {
  amount: number;
  created_at: string;
  email_address: string;
  fullname: string;
  id: string;
  payment_url: string;
  provider_response: string | null;
  status: string;
};
