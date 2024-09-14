import Button from '@/components/button';
import { OptionProp } from '@/components/form/models';
import SelectField from '@/components/form/selectfield/SelectField';
import TextField from '@/components/form/textfield/TextField';
import { expertiseOptions, roleOptions, sessions, topicsOfInterest } from '@/utils/mock-data';
import { Field, Form, Formik, useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import styles from './order.module.scss';
// import AttendeeGroup from './AttendeeGroup';
import { CacheKeys } from '@/utils/constants';
import { getMultiOptionsValue, getOptionsValue } from '@/utils/helper';
import { useQueryClient } from '@tanstack/react-query';
import { TicketPurchaseData } from '../../model';
import AttendeeGroup from './AttendeeGroup';

interface IOrderProps {
  handleNext: () => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}
interface FormValues {
  fullName: string;
  email: string;
  role: string;
  expertLevel: string;
  topicsOfInterest: string[];
  sessionsOfInterest: string[];
  oneDayAccessEmails: string[];
  twoDaysAccessEmails: string[];
  ticketType: 'personal' | 'two_days' | 'one_day' | 'both';
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be at most 50 characters'),

  email: Yup.string().required('Email is required').email('Email is invalid'),

  ticketType: Yup.string().required().oneOf(['personal', 'one_day', 'two_days', 'both']),

  role: Yup.string().when('ticketType', ([ticketType], schema) => {
    return ticketType === 'personal' ? schema.required('Role is required') : schema.notRequired();
  }),

  expertLevel: Yup.string().when('ticketType', ([ticketType], schema) => {
    return ticketType === 'personal'
      ? schema.required('Expertise level is required')
      : schema.notRequired();
  }),

  topicsOfInterest: Yup.array()
    .of(Yup.string())
    .when('ticketType', ([ticketType], schema) => {
      return ticketType === 'personal'
        ? schema
            .required('Topics of interest are required')
            .min(1, 'Select at least one topic of interest')
            .max(5, 'Select at most five topics of interest')
        : schema.notRequired();
    }),

  sessionsOfInterest: Yup.array()
    .of(Yup.string())
    .when('ticketType', ([ticketType], schema) => {
      return ticketType === 'personal'
        ? schema
            .required('Sessions of interest are required')
            .min(1, 'Select at least one session of interest')
            .max(3, 'Select at most three sessions of interest')
        : schema.notRequired();
    }),

  oneDayAccessEmails: Yup.array()
    .of(Yup.string())
    .when('ticketType', ([ticketType], schema) => {
      return ['one_day', 'both'].includes(ticketType)
        ? schema
            .required('One Day Ticket Emails are required')
            .min(1, 'Select at least one session of interest')
        : schema.notRequired();
    }),

  twoDaysAccessEmails: Yup.array()
    .of(Yup.string())
    .when('ticketType', ([ticketType], schema) => {
      return ['two_days', 'both'].includes(ticketType)
        ? schema
            .required('Two Days Ticket Emails are required')
            .min(1, 'Select at least one session of interest')
        : schema.notRequired();
    }),
});

export const OrderInformation: React.FC<IOrderProps> = ({ handleNext, setActiveStep }) => {
  const queryClient = useQueryClient();

  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  /**
   * @returns {boolean | "one_day" | "two_days"}
   * - `false` if purchasing for others or if no tickets are selected.
   * - `"one_day"` if only one-day tickets are selected.
   * - `"two_days"` if only two-day tickets are selected.
   * - `true` if purchasing exactly one ticket for self.
   */
  const ticketType = useMemo(() => {
    if (!getTicketPurchaseData?.selectedTickets) {
      setActiveStep(1);

      //  Just to resolve Type Issues
      return 'personal';
    }

    const { one_day, two_days } = getTicketPurchaseData?.selectedTickets;

    const totalTicketQuantity = one_day.quantity + two_days.quantity;

    if (totalTicketQuantity === 1) return 'personal';

    if (one_day.quantity === 0) return 'two_days';

    if (two_days.quantity === 0) return 'one_day';

    return 'both';
  }, [getTicketPurchaseData?.selectedTickets]);

  const initialValues: FormValues = {
    fullName: getTicketPurchaseData?.buyerInformation?.fullName || '',
    email: getTicketPurchaseData?.buyerInformation?.email_address || '',
    role: getTicketPurchaseData?.personalOrderInformation?.role || '',
    expertLevel: getTicketPurchaseData?.personalOrderInformation?.expertise || '',
    topicsOfInterest: getTicketPurchaseData?.personalOrderInformation?.topicsOfInterest || [],
    sessionsOfInterest: getTicketPurchaseData?.personalOrderInformation?.sessionsOfInterest || [],
    oneDayAccessEmails: getTicketPurchaseData?.othersOrderInformation?.oneDayAccessEmails || [],
    twoDaysAccessEmails: getTicketPurchaseData?.othersOrderInformation?.twoDaysAccessEmails || [],
    ticketType,
  };

  const handleProceed = (values: typeof initialValues) => {
    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
      return {
        ...prevData,
        buyerInformation: {
          fullName: values.fullName,
          email_address: values.email,
        },
        personalOrderInformation: {
          expertise: values.expertLevel,
          role: values.role,
          topicsOfInterest: values.topicsOfInterest,
          sessionsOfInterest: values.sessionsOfInterest,
        },
        othersOrderInformation: {
          oneDayAccessEmails: values.oneDayAccessEmails,
          twoDaysAccessEmails: values.twoDaysAccessEmails,
        },
      };
    });

    handleNext();
  };

  const { setFieldValue, handleSubmit, handleChange, values, errors, isValid, submitForm } =
    useFormik({
      enableReinitialize: true,
      isInitialValid: false,
      initialValues,
      validationSchema,
      onSubmit: handleProceed,
    });

  const handleAddTicketMails = (data: string[], type: 'one_day' | 'two_days') => {
    if (type === 'one_day') {
      setFieldValue('oneDayAccessEmails', data);
    }

    if (type === 'two_days') {
      setFieldValue('twoDaysAccessEmails', data);
    }
  };

  // Clear the email field if the user updates the amount of tickets to be lesser than the previous value
  useEffect(() => {
    if (!getTicketPurchaseData?.selectedTickets) return;

    const { one_day, two_days } = getTicketPurchaseData?.selectedTickets;

    if (one_day.quantity <= values.oneDayAccessEmails.length) {
      setFieldValue('oneDayAccessEmails', []);
    }

    if (two_days.quantity <= values.twoDaysAccessEmails.length) {
      setFieldValue('twoDaysAccessEmails', []);
    }
  }, [getTicketPurchaseData?.selectedTickets]);

  const showCheckoutButton = useMemo(() => {
    if (!getTicketPurchaseData?.selectedTickets) return false;

    const { one_day, two_days } = getTicketPurchaseData?.selectedTickets;

    const totalTicketQuantity = one_day.quantity + two_days.quantity;

    if (totalTicketQuantity === 1) return true;

    const { oneDayAccessEmails, twoDaysAccessEmails } = values;

    if (
      oneDayAccessEmails.length === one_day.quantity &&
      twoDaysAccessEmails.length === two_days.quantity
    )
      return true;

    return false;
  }, [
    getTicketPurchaseData?.selectedTickets,
    values.oneDayAccessEmails,
    values.twoDaysAccessEmails,
  ]);

  return (
    <div className={styles.or_container}>
      <h3 className={styles.or_container_title}>Buyer Information</h3>

      <Formik
        enableReinitialize
        isInitialValid={false}
        onSubmit={handleProceed}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        <Form className={styles.or_form} onSubmit={handleSubmit}>
          <Field
            as={TextField}
            name='fullName'
            id='fullName'
            label='Full Name'
            placeholder='Enter Full Name'
            value={values.fullName}
            onChange={handleChange}
          />

          <Field
            as={TextField}
            name='email'
            id='email'
            label='Email address'
            placeholder='example@gmail.com'
            value={values.email}
            onChange={handleChange}
          />

          <div className={`${styles.or_form} ${styles.inner_form}`}>
            {ticketType == 'personal' && (
              <>
                <Field
                  disabled
                  as={TextField}
                  name='fullName'
                  id='fullName'
                  label='Full Name'
                  placeholder='Enter Full Name'
                  value={values.fullName}
                  onChange={handleChange}
                />

                <Field
                  disabled
                  as={TextField}
                  name='email'
                  id='email'
                  label='Email address'
                  placeholder='example@gmail.com'
                  value={values.email}
                  onChange={handleChange}
                />

                <Field
                  as={SelectField}
                  id='role'
                  label='Role'
                  defaultValue={getOptionsValue(values.role, roleOptions)}
                  placeholder='Select role'
                  options={roleOptions}
                  onChange={(valueObj: OptionProp) => setFieldValue('role', valueObj.value)}
                  error={errors.role}
                />

                <Field
                  isMulti
                  as={SelectField}
                  id='topicsOfInterest'
                  label='Topics of Interest'
                  defaultValue={getMultiOptionsValue(values.topicsOfInterest, topicsOfInterest)}
                  placeholder='Select topics of interest'
                  options={topicsOfInterest}
                  onChange={(selectedOptions: OptionProp[]) => {
                    const selectedValues = selectedOptions.map((option) => option.value);
                    setFieldValue('topicsOfInterest', selectedValues);
                  }}
                  error={errors.topicsOfInterest}
                />

                <Field
                  isMulti
                  as={SelectField}
                  id='sessionsOfInterest'
                  label='Sessions of Interest'
                  defaultValue={getMultiOptionsValue(values.sessionsOfInterest, sessions)}
                  placeholder='Select sessions of interest'
                  options={sessions}
                  onChange={(selectedOptions: OptionProp[]) => {
                    const selectedValues = selectedOptions.map((option) => option.value);
                    setFieldValue('sessionsOfInterest', selectedValues);
                  }}
                  error={errors.sessionsOfInterest}
                />

                <Field
                  as={SelectField}
                  id='expertLevel'
                  label='Level of Expertise'
                  placeholder='Select expertise'
                  defaultValue={getOptionsValue(values.expertLevel, expertiseOptions)}
                  options={expertiseOptions}
                  onChange={(valueObj: OptionProp) => setFieldValue('expertLevel', valueObj.value)}
                  error={errors.expertLevel}
                />
              </>
            )}

            {ticketType !== 'personal' && (
              <div className={styles.ticket_information}>
                <h3 className={styles.or_container_title}>Ticket Information</h3>

                <div className={styles.ticket_information_form}>
                  {(ticketType === 'one_day' || ticketType === 'both') && (
                    <AttendeeGroup
                      title='One-Day Access'
                      buttonText='Save Information'
                      defaultValue={values.oneDayAccessEmails}
                      handleSave={(data) => handleAddTicketMails(data, 'one_day')}
                      limit={getTicketPurchaseData?.selectedTickets?.one_day?.quantity}
                    />
                  )}

                  {(ticketType === 'two_days' || ticketType === 'both') && (
                    <AttendeeGroup
                      title='Two-Day Access'
                      buttonText='Save Information'
                      defaultValue={values.twoDaysAccessEmails}
                      handleSave={(data) => handleAddTicketMails(data, 'two_days')}
                      limit={getTicketPurchaseData?.selectedTickets?.two_days?.quantity}
                    />
                  )}
                </div>
              </div>
            )}

            {((ticketType !== 'personal' && showCheckoutButton) || ticketType === 'personal') && (
              <Button
                fullWidth
                type='submit'
                onClick={submitForm}
                text='Proceed to checkout'
                variant={isValid ? 'primary' : 'disabled'}
                disabled={!isValid}
              />
            )}
          </div>
        </Form>
      </Formik>
    </div>
  );
};
