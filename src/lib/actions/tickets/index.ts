import { TicketCheckoutPayload } from './models';
import client from '../../axios';

export const ticketCheckout = async (props: TicketCheckoutPayload) => {
  try {
    const { data } = await client.post(`/checkouts`, props);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
