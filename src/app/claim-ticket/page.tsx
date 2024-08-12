'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import * as Yup from 'yup';
import Header from '@/components/header';
import { Formik, Field, Form } from 'formik';
import TextField from '@/components/form/textfield/TextField';
import SelectField from '@/components/form/selectfield/SelectField';
import { OptionProp } from '@/components/form/models';
import Button from '@/components/button';
import Modal from '@/components/modals';
import { roleOptions, sizeOptions, expertiseOptions } from '@/utils/mock-data';

const ClaimTickets = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const initialValues = {
    fullName: '',
    email: '',
    role: '',
    customRole: '',
    expertise: '',
    size: '',
  };

  const schema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must be at most 50 characters'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    role: Yup.string().required('Role is required'),
    customRole: Yup.string(),
    expertise: Yup.string().required('Expertise is required'),
    size: Yup.string().required('Size is required'),
  });

  return (
    <div className='claim__tickets'>
      <div className='claim__tickets__container'>
        <Header />

        <div className='claim__tickets__content'>
          <div className='claim__tickets__banner'>
            <Image
              src='https://res.cloudinary.com/defsbafq2/image/upload/v1723026192/claim-ticket_ljyoeo.png'
              width={558}
              height={799}
              alt=''
              priority
            />
          </div>
          <div className='claim__tickets__form'>
            <div className='claim__tickets__heading'>
              <h1>Register</h1>
              <p>Complete your registration in order to claim your ticket</p>
            </div>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={() => setShowSuccessModal(true)}
              validationSchema={schema}
            >
              {({ setFieldValue, isValid, values }) => (
                <Form className='registration__form'>
                  <Field
                    as={TextField}
                    name='fullName'
                    id='fullName'
                    label='Full Name'
                    placeholder='Enter Full Name'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('fullName', event.target.value);
                    }}
                  />
                  <Field
                    as={TextField}
                    name='email'
                    id='email'
                    label='Email Address'
                    placeholder='example@gmail.com'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('email', event.target.value);
                    }}
                  />
                  <Field
                    as={SelectField}
                    label='Role'
                    placeholder='Select'
                    options={roleOptions}
                    id='size'
                    onChange={(valueObj: OptionProp) => setFieldValue('role', valueObj.value)}
                  />
                  {values.role == 'Others' && (
                    <Field
                      as={TextField}
                      name='customRole'
                      id='customRole'
                      label='Specify "Other"'
                      placeholder='Marketing Manager'
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('customRole', event.target.value);
                      }}
                    />
                  )}
                  <Field
                    as={SelectField}
                    label='Level of Expertise'
                    placeholder='Select'
                    options={expertiseOptions}
                    id='size'
                    onChange={(valueObj: OptionProp) => setFieldValue('expertise', valueObj.value)}
                  />
                  <Field
                    as={SelectField}
                    label='Shirt Size'
                    placeholder='Select'
                    options={sizeOptions}
                    id='size'
                    onChange={(valueObj: OptionProp) => setFieldValue('size', valueObj.value)}
                  />
                  <Button text='Register' variant={isValid ? 'primary' : 'disabled'} />
                </Form>
              )}
            </Formik>
            {<Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimTickets;
