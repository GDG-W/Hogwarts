import { TicketPurchaseData } from './model';

import { useEffect, useRef, useState } from 'react';

export const validateTicketPurchaseData = (data: TicketPurchaseData) => {
  const { selectedTickets, buyerInformation, personalOrderInformation, othersOrderInformation } =
    data;

  if (!buyerInformation.fullName || !buyerInformation.email_address) {
    return false;
  }

  if (!selectedTickets) return false;

  const { one_day, two_days } = selectedTickets;

  if (one_day.quantity <= 0 && two_days.quantity <= 0) return false;

  const totalTicketQuantity = one_day.quantity + two_days.quantity;

  if (totalTicketQuantity === 1) {
    const { role, expertise, topicsOfInterest, sessionsOfInterest } = personalOrderInformation;

    if (!role || !expertise || topicsOfInterest.length <= 1 || sessionsOfInterest.length <= 1) {
      return false;
    }
  }

  if (totalTicketQuantity > 1) {
    const { oneDayAccessEmails, twoDaysAccessEmails } = othersOrderInformation;

    if (oneDayAccessEmails.length <= 1 && twoDaysAccessEmails.length <= 1) {
      return false;
    }
  }

  return true;
};

export const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};
