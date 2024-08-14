'use client';

import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Header from '@/components/header';
import ArrowRight from '../../../public/icons/arrow-right.svg';
import InfoCircle from '../../../public/info-circle.svg';
import Button from '@/components/button';
import TextField from '@/components/form/textfield/TextField';
import { initiateSession } from '@/lib/actions/user';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

const Login = () => {
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const initialValues = {
    email: '',
    ticketId: '',
  };
  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    ticketId: Yup.string()
      .matches(
        /^[A-Z0-9]{6,10}$/,
        'Ticket ID must be 6-10 characters long and contain only uppercase letters and numbers',
      )
      .required('Ticket ID is required'),
  });
  const submitForm = async (values: typeof initialValues) => {
    try {
      setFormSubmitting(true);
      const response = await initiateSession({
        email_address: values.email,
        id: values.ticketId,
      });
      const inSetTime = new Date(new Date().getTime() + 60 * 60 * 1000);
      if (response) {
        setFormError('');
        Cookies.set('token', response.token, inSetTime);
        setFormSuccess('Login successful!');
        router.push('/ticket-details');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // AxiosError with a response
          setFormError(error.response.data?.message || 'An error occurred');
        } else if (error.request) {
          // AxiosError with a request but no response
          setFormError('No response received from the server');
        } else {
          // Other AxiosError scenarios
          setFormError(error.message || 'An unknown error occurred');
        }
      } else if (error instanceof Error) {
        // Non-Axios errors that are instances of Error
        setFormError(error.message || 'An unknown error occurred');
      } else {
        // Fallback for unexpected error types
        setFormError('An unexpected error occurred');
      }
    } finally {
      setFormSubmitting(false);
    }
  };
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
            {formSuccess !== '' ? (
              <h2 className='success'>{formSuccess}</h2>
            ) : formError !== '' ? (
              <h2 className='error'>{formError}</h2>
            ) : (
              <h2 className='login__subtitle'>Login to view your ticket</h2>
            )}
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={(values) => submitForm(values)}
              validationSchema={schema}
            >
              {({ errors, setFieldValue, validateField, handleSubmit }) => (
                <Form className='login__form' onSubmit={handleSubmit}>
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
                  <Button type='submit' text='Upgrade Tickets' isLoading={formSubmitting} />
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
