import styles from './order.module.scss';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@/components/form/textfield/TextField';
import SelectField from '@/components/form/selectfield/SelectField';
import { roleOptions, expertiseOptions, topicsOfInterest, sessions } from '@/utils/mock-data';
import Button from '@/components/button';
import React from 'react';
import { OptionProp } from '@/components/form/models';
import AttendeeGroup from './AttendeeGroup';
import { useQueryClient } from '@tanstack/react-query';
import { CacheKeys } from '@/utils/constants';
import { TicketPurchaseData } from '../../model';
import { getMultiOptionsValue, getOptionsValue } from '@/utils/helper';

interface IOrderProps {
  handleNext: () => void;
}
interface FormValues {
  fullName: string;
  email: string;
  role: string;
  isMyTicket: boolean;
  expertLevel: string;
  topicsOfInterest: string[];
  sessionsOfInterest: string[];
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be at most 50 characters'),
  email: Yup.string().required('Email is required').email('Email is invalid'),
  role: Yup.string().required('Role is required'),
  expertLevel: Yup.string().required('Expertise level is required'),
  topicsOfInterest: Yup.array()
    .of(Yup.string())
    .required('Topics of interest are required')
    .min(1, 'Select at least one topic of interest'),
  sessionsOfInterest: Yup.array()
    .of(Yup.string())
    .required('Sessions of interest are required')
    .min(1, 'Select at least one session of interest'),
});

export const OrderInformation: React.FC<IOrderProps> = ({ handleNext }) => {
  const queryClient = useQueryClient();
  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  const initialValues: FormValues = {
    fullName: getTicketPurchaseData?.name || '',
    email: getTicketPurchaseData?.email || '',
    isMyTicket: getTicketPurchaseData?.isForSelf || false,
    role: getTicketPurchaseData?.role || '',
    expertLevel: getTicketPurchaseData?.expertise || '',
    topicsOfInterest: getTicketPurchaseData?.topicsOfInterest || [],
    sessionsOfInterest: getTicketPurchaseData?.sessionsOfInterest || [],
  };

  const handleProceed = (values: typeof initialValues) => {
    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
      return {
        ...prevData,
        name: values.fullName,
        email: values.email,
        expertise: values.expertLevel,
        isForSelf: values.isMyTicket,
        role: values.role,
        topicsOfInterest: values.topicsOfInterest,
        sessionsOfInterest: values.sessionsOfInterest,
      };
    });
    handleNext();
  };

  return (
    <div className={styles.or_container}>
      <h3 className={styles.or_container_title}>Buyer Information</h3>

      <Formik
        validateOnMount
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleProceed}
      >
        {({ setFieldValue, handleSubmit, handleChange, values, isValid }) => (
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

            <label className={styles.or_form_checkbox}>
              <Field
                type='checkbox'
                name='isMyTicket'
                checked={values.isMyTicket}
                onChange={handleChange}
              />
              This ticket belongs to me
            </label>

            {values.isMyTicket ? (
              <div className={`${styles.or_form} ${styles.inner_form}`}>
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
                />

                <Field
                  isMulti
                  as={SelectField}
                  id='topicsOfInterest'
                  label='Topics of Interest'
                  defaultValue={getMultiOptionsValue(values.topicsOfInterest, topicsOfInterest)}
                  placeholder='Select sessions of interest'
                  options={topicsOfInterest}
                  onChange={(selectedOptions: OptionProp[]) => {
                    const selectedValues = selectedOptions.map((option) => option.value);
                    setFieldValue('topicsOfInterest', selectedValues);
                  }}
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
                />

                <Field
                  as={SelectField}
                  id='expertLevel'
                  label='Level of Expertise'
                  placeholder='Select expertise'
                  defaultValue={getOptionsValue(values.expertLevel, expertiseOptions)}
                  options={expertiseOptions}
                  onChange={(valueObj: OptionProp) => setFieldValue('expertLevel', valueObj.value)}
                />

                <Button
                  fullWidth
                  type='submit'
                  text='Proceed to checkout'
                  variant={isValid ? 'primary' : 'disabled'}
                />
              </div>
            ) : (
              <div className={styles.ticket_information}>
                <h3 className={styles.or_container_title}>Ticket Information</h3>

                <div className={styles.ticket_information_form}>
                  <AttendeeGroup title='One-Day Access' buttonText='Save Information' />
                  <AttendeeGroup title='Two-Day Access' buttonText='Save Information' />
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
