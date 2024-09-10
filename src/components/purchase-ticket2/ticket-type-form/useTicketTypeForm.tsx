import { CacheKeys } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTicketContext } from '../context';

export const useTicketTypeForm = (handleSubmit?: () => void) => {
  const {
    state: { oneDayTickets, twoDayTickets, buyerInformation },
  } = useTicketContext();
  const queryClient = useQueryClient();

  const initialValues = {
    one_day: {
      quantity: oneDayTickets.length,
      selectedDay: '',
    },

    two_days: {
      quantity: twoDayTickets.length,
    },
  };

  const validationSchema = Yup.object().shape({
    one_day: Yup.object().shape({
      quantity: Yup.number()
        .min(0, 'Quantity cannot be less than 0')
        .test(
          'at-least-one',
          'At least one day must have a quantity greater than 0',
          function (value) {
            const { two_days } = this.options.context || {};
            const oneDayQuantity = value ?? 0;
            const twoDayQuantity = two_days?.quantity ?? 0;

            return oneDayQuantity > 0 || twoDayQuantity > 0;
          },
        ),

      selectedDay: Yup.string().when('quantity', ([quantity], schema) => {
        return quantity > 0
          ? schema
              .oneOf(['day_one', 'day_two'], 'Invalid selected day')
              .required('Please select a valid day')
          : schema.nullable();
      }),
    }),

    two_days: Yup.object().shape({
      quantity: Yup.number()
        .min(0, 'Quantity cannot be less than 0')
        .test(
          'at-least-one',
          'At least one day must have a quantity greater than 0',
          function (value) {
            const { one_day } = this.options.context || {};
            const oneDayQuantity = one_day?.quantity ?? 0;
            const twoDayQuantity = value ?? 0;

            return oneDayQuantity > 0 || twoDayQuantity > 0;
          },
        ),
    }),
  });

  const handleProceed = (values: typeof initialValues) => {
    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], () => {
      return {
        buyerInformation,
        oneDayTickets,
        twoDayTickets,
      };
    });

    console.log(values);

    handleSubmit && handleSubmit();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: handleProceed,
  });

  return { ...formik, initialValues, handleProceed };
};
