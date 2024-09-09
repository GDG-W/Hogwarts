export type TTicketNumber = {
  oneDay: number;
  twoDays: number;
};

export const allowedTicketTypes = ['day_one', 'day_two'] as const;

export type AllowedTicketType = (typeof allowedTicketTypes)[number];

export type TicketTypes = {
  one_day: {
    quantity: number;
    selectedDay: AllowedTicketType | undefined;
  };
  two_day: {
    quantity: 0;
  };
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
