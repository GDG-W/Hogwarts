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
