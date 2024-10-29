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
  coupon_code?: string;
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

export type CouponResponse = {
  code: string;
  discount_rate: number;
  total_units: number;
  available_units: number;
};

export type ClaimTicketPayload = {
  token: string;
  fullname: string;
  gender: string;
  level_of_expertise: string;
  role: string;
  interests: string[];
  sessions: string[];
};

export type UpdateType = 'change_day' | 'upgrade_ticket';

export type UpdateTicketPayload = {
  ticket_id: string;
  update_type: UpdateType;
  token: string;
};

export interface TicketDetailsResponse {
  created_at: string;
  email_address: string;
  fullname: string;
  id: string;
  interests: string[];
  level_of_expertise: string;
  role: string;
  sessions: string[];
  ticket: { id: string; price: number; tag: Tag; title: string };
  ticket_id: string;
  ticket_updated: boolean;
  payment_url?: string;
}

export enum Dates {
  'day_one' = '15th Nov, 2024',
  'day_two' = '16th Nov, 2024',
  'both_days' = '15th & 16th Nov, 2024',
}
