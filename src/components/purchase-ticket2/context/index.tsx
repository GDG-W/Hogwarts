import { fetchTickets } from '@/lib/actions/tickets';
import { Ticket } from '@/lib/actions/tickets/models';
import { CacheKeys } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { findTicketType, getTicketPrice } from '../tickets.util';
import { TicketAction, TicketContextInterface, TicketState } from './model';

const initialState: TicketState = {
  buyerInformation: {
    name: '',
    email: '',
  },
  oneDayTickets: [],
  twoDayTickets: [],
  ticketTypes: [],
  ticketTotalPrice: 0,
  pageLoading: false,
};

const TicketContext = createContext<TicketContextInterface>({
  state: initialState,
  dispatch: () => undefined,
});

function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case 'SET_TICKET_TYPES':
      return {
        ...state,
        ticketTypes: action.payload,
      };
    case 'SET_BUYER_INFORMATION':
      return {
        ...state,
        buyerInformation: action.payload,
      };
    case 'UPDATE_TICKET_AMOUNT':
      const isTwoDaysTicket = action.payload.type === 'two_days';
      const ticketKey = isTwoDaysTicket ? 'twoDayTickets' : 'oneDayTickets';

      const apiTicket = findTicketType(action.payload.type, state.ticketTypes);

      if (!apiTicket) return { ...state };

      const tickets = Array.from({ length: action.payload.quantity }, () => ({
        id: apiTicket.id,
        email: '',
      }));

      const updatedState = {
        ...state,
        [ticketKey]: tickets,
      };

      // Recalculate the ticket total
      const oneDayPrice = getTicketPrice({ selectedDay: 'day_one' });
      const twoDayPrice = getTicketPrice('two_days');
      const oneDayTotal = updatedState.oneDayTickets.length * oneDayPrice;
      const twoDayTotal = updatedState.twoDayTickets.length * twoDayPrice;
      const ticketTotalPrice = oneDayTotal + twoDayTotal;

      return {
        ...updatedState,
        ticketTotalPrice,
      };

    case 'TOGGLE_PAGE_LOAD':
      return {
        ...state,
        pageLoading: action.payload,
      };
    default:
      return state;
  }
}

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const { data, isLoading } = useQuery<Ticket[]>({
    queryKey: [CacheKeys.USER_TICKETS],
    queryFn: fetchTickets,
    // enabled: !state.ticketTypes || state.ticketTypes.length > 0,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'SET_TICKET_TYPES',
        payload: data,
      });
    }

    dispatch({
      type: 'TOGGLE_PAGE_LOAD',
      payload: isLoading,
    });
  }, [data, isLoading]);

  return <TicketContext.Provider value={{ state, dispatch }}>{children}</TicketContext.Provider>;
};
