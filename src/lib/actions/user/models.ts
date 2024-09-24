export type Tag = 'both_days' | 'day_two' | 'day_one';
export type TicketType = {
  title: string;
  tag: string;
};
export type Expertise = 'Beginner' | 'Intermediate' | 'Expert';
export type ShirtSize = 'xs' | 's' | 'm' | 'lg' | 'xl' | 'xxl';

export type InitiateSessionProps = {
  email_address: string;
  id: string;
};

export type InitiateSessionResponse = {
  id: string;
  fullname: string;
  email_address: string;
  role: string;
  level_of_expertise: Expertise;
  shirt_size: ShirtSize;
  ticket_id: string;
  created_at: string;
  token: string;
};

export type GetUserProfileResponse = {
  id: string;
  fullname: string;
  email_address: string;
  role: string;
  level_of_expertise: Expertise;
  shirt_size: ShirtSize;
  ticket_id: string;
  created_at: string;
  ticket: TicketType;
};

export type SetUpProfileProps = {
  token: string;
  fullname: string;
  role: string;
  level_of_expertise: Expertise;
  shirt_size: ShirtSize;
};
