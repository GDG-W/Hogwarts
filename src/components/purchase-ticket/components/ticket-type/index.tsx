import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SelectField from '@/components/form/selectfield/SelectField';
import TextField from '@/components/form/textfield/TextField';
import styles from './type.module.scss';
import { OptionProp } from '@/components/form/models';
import Button from '@/components/button';
import { TicketPurchaseData, TTicketNumber } from '../../model';
import { dayOptions } from '@/utils/mock-data';
import { CacheKeys } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import { getOptionsValue } from '@/utils/helper';

interface ITicketTypeProps {
  selectDays: number;
  ticketNo: TTicketNumber;
  handleChangeSelectDays: React.Dispatch<React.SetStateAction<number>>;
  handleChangeTicketNo: React.Dispatch<React.SetStateAction<TTicketNumber>>;
  handleNext: () => void;
}

export const TicketType: React.FC<ITicketTypeProps> = ({
  ticketNo,
  handleChangeSelectDays,
  handleChangeTicketNo,
  handleNext,
}) => {
  const queryClient = useQueryClient();
  const onHandleChangeSelectDays = (valueObj: OptionProp | OptionProp[]) => {
    if (Array.isArray(valueObj)) return;
    handleChangeSelectDays(Number(valueObj.value));
  };
  const oneDayTicket = ticketNo.oneDay;
  const twoDayTicket = ticketNo.twoDays;

  const getTicketPurchaseData: TicketPurchaseData | undefined = queryClient.getQueryData([
    CacheKeys.USER_PURCHASE_TICKET,
  ]);

  console.log(getTicketPurchaseData);

  const initialValues = {
    selectedDay: getTicketPurchaseData?.selectedDay || '',
    oneDayTicketNumber: getTicketPurchaseData?.oneDayTicketNumber || 0,
    twoDayTicketNumber: getTicketPurchaseData?.twoDayTicketNumber || 0,
  };

  const validationSchema = Yup.object({
    selectedDay: Yup.string().test(
      'day-ticket-dependency',
      'Please select a day when a ticket is chosen',
      function (value) {
        const { oneDayTicketNumber } = this.parent;
        // Check if the day must be selected (if ticket number > 0)
        return oneDayTicketNumber === 0 || !!value;
      },
    ),
    oneDayTicketNumber: Yup.number()
      .min(0, 'Cannot be negative')
      .max(1, 'A user may only buy one ticket at this time')
      .test(
        'ticket-day-dependency',
        'Please select at least one ticket when a day is chosen',
        function (value) {
          const { selectedDay } = this.parent;
          // Check if the ticket number must be provided (if a day is selected)
          return !selectedDay || (value !== undefined && value > 0);
        },
      ),
    twoDayTicketNumber: Yup.number()
      .min(0, 'Cannot be negative')
      .max(1, 'A user may only buy one ticket at this time'),
  });

  const handleProceed = (values: typeof initialValues) => {
    queryClient.setQueryData([CacheKeys.USER_PURCHASE_TICKET], (prevData: TicketPurchaseData) => {
      return {
        ...prevData,
        ticketNo: {
          oneDay: values.oneDayTicketNumber,
          twoDays: values.twoDayTicketNumber,
        },
        selectedDay: values.selectedDay,
        oneDayTicketNumber: values.oneDayTicketNumber,
        twoDayTicketNumber: values.twoDayTicketNumber,
      };
    });
    handleNext();
  };

  return (
    <div className={styles.t_container}>
      <div className={styles.t_container_header}>
        <h3 className={styles.t_container_header_title}>Select Ticket Type</h3>
        <p className={styles.t_container_header_detail}> Choose your ticket for entry pass</p>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleProceed}
      >
        {({ isValid, values, errors, setFieldValue, submitForm }) => (
          <Form>
            <div className={styles.t_container_body}>
              <div className={styles.t_container_box}>
                <div className={styles.t_container_box_wrapper}>
                  <h5 className={styles.t_container_box_wrapper_title}>One-day access</h5>
                  <span className={styles.t_container_box_wrapper_title}>N7,000</span>
                </div>

                <div className={styles.t_container_box_wrapper}>
                  <p className={styles.t_container_box_wrapper_detail}>
                    Attend DevFest Lagos 2024 for just a day with access to all talks and sessions
                  </p>

                  <div className={styles.input_wrapper}>
                    <Field
                      disabled={values.twoDayTicketNumber}
                      as={SelectField}
                      width='135px'
                      placeholder='Select Day'
                      options={dayOptions}
                      defaultValue={getOptionsValue(values.selectedDay, dayOptions)}
                      id='selectedDay'
                      onChange={(valueObj: OptionProp) => {
                        setFieldValue('selectedDay', valueObj.value);
                        onHandleChangeSelectDays(valueObj);
                      }}
                    />

                    <Field
                      disabled={values.twoDayTicketNumber}
                      as={TextField}
                      width='75px'
                      id='oneDayTicketNumber'
                      placeholder='0'
                      value={oneDayTicket > 0 ? oneDayTicket.toString() : ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('oneDayTicketNumber', Number(event.target.value));
                        setFieldValue('twoDayTicketNumber', 0);
                        handleChangeTicketNo((prevState) => ({
                          ...prevState,
                          oneDay: Number(event.target.value),
                        }));
                      }}
                    />
                  </div>
                </div>
                {
                  <p className={styles.error}>
                    {(!errors.selectedDay?.includes('NaN') && errors.selectedDay) ||
                      (!errors.oneDayTicketNumber?.includes('NaN') && errors.oneDayTicketNumber)}
                  </p>
                }
              </div>

              <div className={styles.t_container_box}>
                <div className={styles.t_container_body_holder_title}></div>
              </div>
            </div>

            <div className={styles.t_container_body}>
              <div className={styles.t_container_box}>
                <div className={styles.t_container_box_wrapper}>
                  <h5 className={styles.t_container_box_wrapper_title}>Two-day access</h5>
                  <span className={styles.t_container_box_wrapper_title}>N10,000</span>
                </div>

                <div className={styles.t_container_box_wrapper}>
                  <p className={styles.t_container_box_wrapper_detail}>
                    Attend DevFest Lagos 2024 for 2 days with access to all talks and sessions
                  </p>

                  <div className={styles.input_wrapper}>
                    <Field
                      disabled={values.oneDayTicketNumber}
                      as={TextField}
                      width='75px'
                      id='twoDayTicketNumber'
                      placeholder='0'
                      value={twoDayTicket > 0 ? twoDayTicket.toString() : ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('twoDayTicketNumber', Number(event.target.value));
                        setFieldValue('oneDayTicketNumber', 0);
                        setFieldValue('selectedDay', ''); // remove in next rollout
                        handleChangeSelectDays(2);
                        handleChangeTicketNo((prevState) => ({
                          ...prevState,
                          twoDays: Number(event.target.value),
                        }));
                      }}
                    />
                  </div>
                </div>
                <p className={styles.error}>
                  {!errors.twoDayTicketNumber?.includes('NaN') && errors.twoDayTicketNumber}
                </p>
              </div>

              <div className={styles.t_container_box}>
                <div className={styles.t_container_body_holder_title}></div>
              </div>
            </div>

            <Button
              fullWidth
              type='submit'
              text={
                <>
                  <span>Buy ticket</span>
                  {oneDayTicket * 7000 + twoDayTicket * 10000 !== 0 && (
                    <span className={styles.total__mobile}>
                      N{(oneDayTicket * 7000 + twoDayTicket * 10000).toLocaleString()}
                    </span>
                  )}
                </>
              }
              onClick={submitForm}
              variant={isValid ? 'primary' : 'disabled'}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
