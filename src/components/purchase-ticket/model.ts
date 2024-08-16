export type TTicketNumber = {
  oneDay: number;
  twoDays: number;
};
export type TicketPurchaseData = {
  selectedDay?: string;
  ticketNo?: TTicketNumber;
  oneDayTicketNumber: number;
  twoDayTicketNumber: number;
  name?: string;
  email?: string;
  role?: string;
  expertise?: string;
  isForSelf?: boolean;
  topicsOfInterest: string[];
  sessionsOfInterest: string[];
};
