export type SelectedDays = 'day_one' | 'day_two';

export type SelectedTickets = {
  one_day: {
    quantity: number;
    selectedDay: SelectedDays | null;
  };

  two_days: {
    quantity: number;
  };
};

type BuyForOthersForm = {
  oneDayAccessEmails: string[];
  twoDaysAccessEmails: string[];
};

type BuyForYourselfForm = {
  role: string;
  expertise: string;
  topicsOfInterest: string[];
  sessionsOfInterest: string[];
};

type BuyerInfo = {
  fullName: string;
  email_address: string;
};

export type TicketPurchaseData = {
  selectedTickets: SelectedTickets;
  buyerInformation: BuyerInfo;
  personalOrderInformation: BuyForYourselfForm;
  othersOrderInformation: BuyForOthersForm;
  couponCode: string;
};
