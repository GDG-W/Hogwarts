import { TicketCheckoutPayload, TicketCheckoutResponse } from './models';
import client from '../../axios';

export const ticketCheckout = async (
  props: TicketCheckoutPayload,
): Promise<TicketCheckoutResponse> => {
  try {
    const { data } = await client.post(`/checkouts`, props);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchTickets = async () => {
  try {
    const { data } = await client.get(`/tickets`);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
