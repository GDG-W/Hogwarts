export type ClientTicket = {
  id: string;
  email: string;
};

export type SelectedDays = 'day_one' | 'day_two';
export type ClientTicketType = 'one_day' | { selectedDay: SelectedDays } | 'two_days';

export interface BuyerInfo {
  name: string;
  email: string;
}
