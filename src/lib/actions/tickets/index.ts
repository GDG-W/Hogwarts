import client from '../../axios';
import {
  ClaimTicketPayload,
  CouponResponse,
  TicketCheckoutPayload,
  TicketCheckoutResponse,
  UpdateTicketPayload,
} from './models';

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

export const getCouponInformation = async (coupon: string): Promise<CouponResponse> => {
  try {
    const { data } = await client.get(`/coupons/${coupon}`);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const claimTicket = async ({
  ticket_id,
  payload,
}: {
  ticket_id: string;
  payload: ClaimTicketPayload;
}) => {
  try {
    const { data } = await client.post(`/users/${ticket_id}/profiles`, payload);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateTicket = async ({ token, ...others }: UpdateTicketPayload) => {
  try {
    const { data } = await client.post(`/tickets/updates`, others, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
