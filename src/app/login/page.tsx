'use client';

import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Header from '@/components/header';
import { handleError } from '@/utils/helper';
// import ArrowRight from '../../../public/icons/arrow-right.svg';
import InfoCircle from '../../../public/info-circle.svg';
import Button from '@/components/button';
import TextField from '@/components/form/textfield/TextField';
import { initiateSession } from '@/lib/actions/user';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

const Login = () => {
  const [formError, setFormError] = useState('');
  const initialValues = {
    email: '',
    ticketId: '',
  };
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: initiateSession,
    onSuccess: (data) => {
      Cookies.set('token', data.token, { expires: 60 * 60 + 1000 }); // 1 hour expiration
      router.push('/ticket-details');
    },
    onError: (error: unknown) => {
      console.log(error);
      handleError(error, setFormError);
    },
  });

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    ticketId: Yup.string()
      .matches(/^[A-Z0-9]{6,10}$/, 'Incorrect ticket ID')
      .required('Ticket ID is required'),
  });

  const submitForm = (values: typeof initialValues) => {
    loginMutation.mutateAsync({
      email_address: values.email,
      id: values.ticketId,
    });
  };

  return (
    <div className='login'>
      <div className='backdrop'>
        <div className='container'>
          <Header
          // navContent={
          //   <>
          //     <span>Get Tickets For Your Friends</span>
          //     <ArrowRight />
          //   </>
          // }
          // handleClick={() => {}}
          />
          <div className='login__card'>
            <h1 className='login__title'>Welcome</h1>
            {formError !== '' ? (
              <h2 className='error'>{formError}</h2>
            ) : (
              <h2 className='login__subtitle'>Login to view your ticket</h2>
            )}
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={submitForm}
              validationSchema={schema}
            >
              {({ errors, setFieldValue, validateField, handleSubmit, submitForm, isValid }) => (
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
                  <Button
                    disabled={!isValid}
                    type='submit'
                    onClick={submitForm}
                    text='Log In'
                    isLoading={loginMutation.isPending}
                  />
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
