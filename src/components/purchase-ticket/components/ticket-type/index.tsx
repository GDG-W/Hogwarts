import Button from '@/components/button';
import { OptionProp } from '@/components/form/models';
import SelectField from '@/components/form/selectfield/SelectField';
import TextField from '@/components/form/textfield/TextField';
import { TICKET_PRICES } from '@/utils/constants';
import { getOptionsValue } from '@/utils/helper';
import { dayOptions } from '@/utils/mock-data';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { SelectedDays, SelectedTickets } from '../../model';
import styles from './type.module.scss';
interface TicketTypeFormProps {
  selectedTickets: SelectedTickets;
  setSelectedTickets: React.Dispatch<React.SetStateAction<SelectedTickets>>;
  handleSubmit: (values: SelectedTickets) => void;
}

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

export const TicketType = (props: TicketTypeFormProps) => {
  const { selectedTickets, setSelectedTickets, handleSubmit } = props;

  return (
    <div className={styles.t_container}>
      <div className={styles.t_container_header}>
        <h3 className={styles.t_container_header_title}>Select Ticket Type</h3>
        <p className={styles.t_container_header_detail}> Choose your ticket for entry pass</p>
      </div>

      <Formik
        // enableReinitialize
        onSubmit={handleSubmit}
        initialValues={selectedTickets}
        validationSchema={validationSchema}
        isInitialValid={false}
      >
        {({ isValid, values, errors, setFieldValue, submitForm }) => (
          <Form>
            <div className={styles.t_container_body}>
              <div className={styles.t_container_box}>
                <div className={styles.t_container_box_wrapper}>
                  <h5 className={styles.t_container_box_wrapper_title}>One-day access</h5>
                  <span className={styles.t_container_box_wrapper_title}>₦7,000</span>
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
                      defaultValue={getOptionsValue(values.one_day.selectedDay ?? '', dayOptions)}
                      id='selectedDay'
                      onChange={(valueObj: OptionProp) => {
                        setFieldValue('one_day.selectedDay', valueObj.value);
                        setSelectedTickets({
                          ...selectedTickets,
                          one_day: {
                            ...selectedTickets.one_day,
                            selectedDay: valueObj.value as SelectedDays,
                          },
                        });
                      }}
                    />

                    <Field
                      disabled={!values.one_day.selectedDay}
                      as={TextField}
                      width='75px'
                      id='one_day.quantity'
                      placeholder='0'
                      value={values.one_day.quantity > 0 ? values.one_day.quantity.toString() : ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('one_day.quantity', Number(event.target.value));
                        setSelectedTickets({
                          ...selectedTickets,
                          one_day: {
                            ...selectedTickets.one_day,
                            quantity: Number(event.target.value),
                          },
                        });
                      }}
                    />
                  </div>
                </div>

                <p className={styles.error}>
                  {(() => {
                    const { selectedDay, quantity } = errors?.one_day || {};

                    const hasSelectedDayError = selectedDay && !selectedDay.includes('NaN');
                    const hasQuantityError = quantity && !quantity.includes('NaN');

                    return hasSelectedDayError ? selectedDay : hasQuantityError ? quantity : null;
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
                  <span className={styles.t_container_box_wrapper_title}>₦10,000</span>
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
                      value={
                        values.two_days.quantity > 0 ? values.two_days.quantity.toString() : ''
                      }
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('two_days.quantity', Number(event.target.value));
                        setSelectedTickets({
                          ...selectedTickets,
                          two_days: {
                            ...selectedTickets.two_days,
                            quantity: Number(event.target.value),
                          },
                        });
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

                  {(() => {
                    const { one_day, two_days } = values;

                    const oneDayTotal = one_day.quantity * TICKET_PRICES.DAY_ONE;
                    const twoDaysTotal = two_days.quantity * TICKET_PRICES.DAY_TWO;

                    if (oneDayTotal + twoDaysTotal == 0) return;

                    return (
                      <span className={styles.total__mobile}>
                        N{(oneDayTotal + twoDaysTotal).toLocaleString()}
                      </span>
                    );
                  })()}
                </>
              }
              onClick={submitForm}
              variant={isValid ? 'primary' : 'disabled'}
              disabled={!isValid}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
