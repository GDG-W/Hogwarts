'use client';

import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Header from '@/components/header';
import ArrowRight from '../../../public/icons/arrow-right.svg';
import InfoCircle from '../../../public/info-circle.svg';
import Button from '@/components/button';
import TextField from '@/components/form/textfield/TextField';

const Login = () => {
  const [formError, setFormError] = useState('');

  const initialValues = {
    email: '',
    ticketId: '',
  };

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    ticketId: Yup.string()
      .matches(
        /^[A-Z0-9]{6,10}$/,
        'Ticket ID must be 6-10 characters long and contain only uppercase letters and numbers',
      )
      .required('Ticket ID is required'),
  });

  return (
    <div className='login'>
      <div className='backdrop'>
        <div className='container'>
          <Header
            navContent={
              <>
                <span>Get Tickets For Your Friends</span>
                <ArrowRight />
              </>
            }
            handleClick={() => {}}
          />
          <div className='login__card'>
            <h1 className='login__title'>Welcome</h1>
            {formError ? (
              <h2 className='error'>{formError}</h2>
            ) : (
              <h2 className='login__subtitle'>Login to view your ticket</h2>
            )}

            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={() => {}}
              validationSchema={schema}
            >
              {({ errors, setFieldValue, validateField }) => (
                <Form className='login__form'>
                  <Field
                    as={TextField}
                    name='email'
                    type='email'
                    id='email'
                    label='Email Address'
                    placeholder='user@email.com'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('email', event.target.value);
                      setFormError('');
                    }}
                    onBlur={() => {
                      validateField('email').then(() => {
                        if (errors.email) {
                          setFormError(errors.email);
                        }
                      });
                    }}
                    bottomLeft={
                      <>
                        <InfoCircle />
                        <p>The email associated with your ticket</p>
                      </>
                    }
                    error={errors.email}
                  />

                  <Field
                    as={TextField}
                    name='ticketId'
                    id='ticketId'
                    label='Ticket ID'
                    extraLabel='(Check Ticket Confirmation Mail)'
                    placeholder='Enter your ticket ID'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('ticketId', event.target.value);
                      setFormError('');
                    }}
                    bottomRight={'Or get your ticket here'}
                    error={errors.ticketId}
                  />
                  <Button type='submit' text='Upgrade Tickets' />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
