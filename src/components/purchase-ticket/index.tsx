import { CacheKeys } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Checkout } from './components/checkout';
import { OrderInformation } from './components/order-information';
import { TicketType } from './components/ticket-type';
import { SelectedTickets, TicketPurchaseData } from './model';
import styles from './ticket.module.scss';

interface IPurchaseTicketProps {
  closeModal: () => void;
  showTicketModal: boolean;
}

const PurchaseTicket = (props: IPurchaseTicketProps) => {
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isOrderInfoComplete, setIsOrderInfoComplete] = useState<boolean>(false);

  // Ticket Type Form
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({
    one_day: {
      quantity: 0,
      selectedDay: null,
    },

    two_days: {
      quantity: 0,
    },
  });

  const handleTicketFormSubmit = (values: SelectedTickets) => {
    const { one_day, two_days } = values;

    if (one_day.quantity <= 0 && two_days.quantity <= 0) return;

    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
      return {
        ...prevData,
        selectedTickets: values,
      };
    });

    setSelectedTickets(values);
    setActiveStep(2);
  };

  const ticketTypeComplete = useMemo(() => {
    const { one_day, two_days } = selectedTickets;

    if (one_day.quantity <= 0 && two_days.quantity <= 0) return false;

    return true;
  }, [selectedTickets]);

  // Order Information  Form
  const handleOrderInfoCompletion = () => {
    setIsOrderInfoComplete(true);
    setActiveStep(3);
  };

  const resetPageState = () => {
    setActiveStep(1);
    setIsOrderInfoComplete(false);
    setSelectedTickets({
      one_day: {
        quantity: 0,
        selectedDay: null,
      },

      two_days: {
        quantity: 0,
      },
    });
  };

  const stepperLists = [
    { name: 'Ticket type', value: 1, isComplete: ticketTypeComplete },
    { name: 'Order information', value: 2, isComplete: isOrderInfoComplete },
    { name: 'Checkout', value: 3 },
  ];

  useEffect(() => {
    if (!props.showTicketModal) {
      resetPageState();
    }
  }, [props.showTicketModal]);

  useEffect(() => {
    if (activeStep === 3) {
      const element = document.querySelector(`.${styles.wrapper_container}`);
      const wrapper = document.querySelector(`.${styles.wrapper}`);

      if (!element || !wrapper) return;

      wrapper?.scrollTo(0, element.scrollHeight);
    }
  }, [activeStep]);

  return (
    <div className={styles.ticket_container}>
      <div className={styles.ticket_body}>
        <div className={styles.title_container}>
          <h3 className={styles.title_container_name}>Purchase Ticket</h3>
          <ul className={styles.title_container_list_group}>
            {stepperLists.map((list, id) => (
              <li
                key={id}
                onClick={() => list.isComplete && setActiveStep(list.value)}
                className={`
                  ${styles.title_container_list_group_item} 
                   ${activeStep >= list.value ? styles.title_container_list_group_active : ''}
                   `}
              >
                {list.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.wrapper_container}>
            {activeStep === 1 && (
              <TicketType
                selectedTickets={selectedTickets}
                setSelectedTickets={setSelectedTickets}
                handleSubmit={handleTicketFormSubmit}
              />
            )}
            {activeStep === 2 && (
              <OrderInformation
                handleNext={handleOrderInfoCompletion}
                setActiveStep={setActiveStep}
              />
            )}

            {activeStep === 3 && (
              <div className={styles.mob_checkout}>
                <Checkout
                  closeModal={props.closeModal}
                  activeStep={activeStep}
                  selectedTickets={selectedTickets}
                />
              </div>
            )}
          </div>
          {activeStep === 1 && (
            <div className={`${styles.wrapper_container} ${styles.wrapper_sticky_top}`}>
              <Checkout
                closeModal={props.closeModal}
                activeStep={activeStep}
                selectedTickets={selectedTickets}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
