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

    if (oneDayAccessEmails.length < 1 && twoDaysAccessEmails.length < 1) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareObjects = (obj1: Record<any, any>, obj2: Record<any, any>): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!compareObjects(obj1[key], obj2[key])) return false;
  }

  return true;
};
