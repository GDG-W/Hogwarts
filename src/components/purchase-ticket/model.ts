export type TTicketNumber = {
  oneDay: number;
  twoDays: number;
};
export type TicketPurchaseData = {
  selectedDay?: string;
  ticketNo?: TTicketNumber;
  name?: string;
  email?: string;
  role?: string;
  expertise?: string;
  shirtSize?: string;
  isForSelf?: boolean;
};
