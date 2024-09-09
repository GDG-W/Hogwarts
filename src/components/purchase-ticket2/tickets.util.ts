import { Ticket } from '@/lib/actions/tickets/models';
import { TICKET_PRICES } from '@/utils/constants';
import { ClientTicketType } from './model';

export const getTicketPrice = (type: ClientTicketType) => {
  if (type === 'two_days') {
    return TICKET_PRICES.DAY_TWO;
  }

  return TICKET_PRICES.DAY_ONE;
};

export const findTicketType = (ticketCriteria: ClientTicketType, availableTickets: Ticket[]) => {
  if (ticketCriteria === 'two_days') {
    return availableTickets.find((ticket) => ticket.tag === 'both_days');
  }

  if (typeof ticketCriteria === 'object' && ticketCriteria.selectedDay) {
    return availableTickets.find((ticket) => ticket.tag === ticketCriteria.selectedDay);
  }

  return undefined;
};
