import Button from '@/components/button';
import { OptionProp } from '@/components/form/models';
import SelectField from '@/components/form/selectfield/SelectField';
import TextField from '@/components/form/textfield/TextField';
import { getOptionsValue } from '@/utils/helper';
import { dayOptions } from '@/utils/mock-data';
import { Field, Form, Formik, useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useTicketContext } from '../context';
import { ClientTicketType, SelectedDays } from '../model';
import styles from './style.module.scss';

export const TicketTypeForm = () => {
  const {
    state: { oneDayTickets, twoDayTickets, ticketTotalPrice },
    dispatch,
  } = useTicketContext();

  const initialValues = {
    one_day: {
      quantity: oneDayTickets.length,
      selected_day: 'day_one',
    },

    two_days: {
      quantity: twoDayTickets.length,
    },
  };

  const validationSchema = Yup.object({
    one_day: Yup.object({
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      selected_day: Yup.string()
        .oneOf(['first', 'second', 'third'], 'Selected day must be valid')
        .required('Selected day is required'),
    }),

    two_days: Yup.object({
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    }),
  });

  // const ticketTotal = useCallback(() => calculateTicketTotal(), [calculateTicketTotal]);

  const handleProceed = (values: typeof initialValues) => {
    console.log(values);
  };

  const { values, setFieldValue, errors, submitForm, isValid } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: handleProceed,
  });

  const handleAddItem = (type: ClientTicketType) => {
    if (type === 'two_days') {
      return dispatch({
        type: 'UPDATE_TICKET_AMOUNT',
        payload: {
          type,
          quantity: values.two_days.quantity,
        },
      });
    }

    return dispatch({
      type: 'UPDATE_TICKET_AMOUNT',
      payload: {
        type,
        quantity: values.one_day.quantity,
      },
    });
  };

  useEffect(() => {
    console.log({
      oneDayTickets,
      twoDayTickets,
    });
  }, [oneDayTickets, twoDayTickets]);

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
                    as={SelectField}
                    width='135px'
                    placeholder='Select Day'
                    options={dayOptions}
                    defaultValue={getOptionsValue(values.one_day.selected_day, dayOptions)}
                    id='selectedDay'
                    onChange={(valueObj: OptionProp) => {
                      setFieldValue('selectedDay', valueObj.value);
                      handleAddItem({ selectedDay: valueObj.value as SelectedDays });
                    }}
                  />

                  <Field
                    as={TextField}
                    width='75px'
                    id='one_day.quantity'
                    placeholder='0'
                    value={values.one_day.quantity > 0 ? values.one_day.quantity.toString() : ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('one_day.quantity', Number(event.target.value));
                      handleAddItem({ selectedDay: values.one_day.selected_day as SelectedDays });
                    }}
                  />
                </div>
              </div>

              <p className={styles.error}>
                {(() => {
                  const { selected_day, quantity } = errors?.one_day || {};

                  const hasSelectedDayError = selected_day && !selected_day.includes('NaN');
                  const hasQuantityError = quantity && !quantity.includes('NaN');

                  return hasSelectedDayError ? selected_day : hasQuantityError ? quantity : null;
                })()}
              </p>
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
                    as={TextField}
                    width='75px'
                    id='two_days.quantity'
                    placeholder='0'
                    value={values.two_days.quantity > 0 ? values.two_days.quantity.toString() : ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('two_days.quantity', Number(event.target.value));
                      // handleAddItem("two_days");
                    }}
                  />
                </div>
              </div>

              <p className={styles.error}>
                {!errors.two_days?.quantity?.includes('NaN') && errors.two_days?.quantity}
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
                {/* {ticketTotal()} */}
                {ticketTotalPrice}
                {/* {oneDayTicket * 7000 + twoDayTicket * 10000 !== 0 && (
                  <span className={styles.total__mobile}>
                    N{(oneDayTicket * 7000 + twoDayTicket * 10000).toLocaleString()}
                  </span>
                )} */}
              </>
            }
            onClick={submitForm}
            variant={isValid ? 'primary' : 'disabled'}
          />
        </Form>
      </Formik>
    </div>
  );
};
