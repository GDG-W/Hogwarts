import { Ticket } from '@/lib/actions/tickets/models';
import { BuyerInfo, ClientTicket, ClientTicketType } from '../model';

export type TicketState = {
  oneDayTickets: ClientTicket[];
  twoDayTickets: ClientTicket[];
  buyerInformation: BuyerInfo;
  ticketTypes: Ticket[];
  ticketTotalPrice: number;
  pageLoading: boolean;
};

export type TicketAction =
  | { type: 'SET_TICKET_TYPES'; payload: Ticket[] }
  | { type: 'SET_BUYER_INFORMATION'; payload: BuyerInfo }
  | { type: 'UPDATE_TICKET_AMOUNT'; payload: { type: ClientTicketType; quantity: number } }
  | { type: 'TOGGLE_PAGE_LOAD'; payload: boolean };

export interface TicketContextInterface {
  state: TicketState;
  dispatch: React.Dispatch<TicketAction>;
}
