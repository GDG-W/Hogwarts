import Button from '@/components/button';
import { OptionProp } from '@/components/form/models';
import SelectField from '@/components/form/selectfield/SelectField';
import TextField from '@/components/form/textfield/TextField';
import { getOptionsValue } from '@/utils/helper';
import { dayOptions } from '@/utils/mock-data';
import { Field, Form, Formik } from 'formik';
import { useTicketContext } from '../context';
import { SelectedDays } from '../model';
import styles from './style.module.scss';
import { useTicketTypeForm } from './useTicketTypeForm';

export const TicketTypeForm = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const {
    state: { ticketTotalPrice },
    dispatch,
  } = useTicketContext();

  const { values, setFieldValue, errors, submitForm, isValid, initialValues, handleProceed } =
    useTicketTypeForm(handleSubmit);

  return (
    <div className={styles.t_container}>
      <div className={styles.t_container_header}>
        <h3 className={styles.t_container_header_title}>Select Ticket Type</h3>
        <p className={styles.t_container_header_detail}> Choose your ticket for entry pass</p>
      </div>

      <Formik initialValues={initialValues} onSubmit={handleProceed}>
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
                    defaultValue={getOptionsValue(values.one_day.selectedDay, dayOptions)}
                    id='selectedDay'
                    onChange={(valueObj: OptionProp) => {
                      setFieldValue('one_day.selectedDay', valueObj.value);

                      dispatch({
                        type: 'UPDATE_TICKET_AMOUNT',
                        payload: {
                          type: { selectedDay: valueObj.value as SelectedDays },
                          quantity: values.one_day.quantity,
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

                      dispatch({
                        type: 'UPDATE_TICKET_AMOUNT',
                        payload: {
                          type: { selectedDay: values.one_day.selectedDay as SelectedDays },
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

                      dispatch({
                        type: 'UPDATE_TICKET_AMOUNT',
                        payload: {
                          type: 'two_days',
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
                {ticketTotalPrice !== 0 && (
                  <span className={styles.total__mobile}>N{ticketTotalPrice}</span>
                )}
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
