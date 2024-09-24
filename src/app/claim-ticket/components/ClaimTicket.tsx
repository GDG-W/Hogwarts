'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import * as Yup from 'yup';
import Header from '@/components/header';
import { Formik, Field, Form } from 'formik';
import TextField from '@/components/form/textfield/TextField';
import SelectField from '@/components/form/selectfield/SelectField';
import { OptionProp } from '@/components/form/models';
import Button from '@/components/button';
import Modal from '@/components/modals';
import { roleOptions, expertiseOptions, sessions, topicsOfInterest } from '@/utils/mock-data';
import { CacheKeys } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { claimTicket } from '@/lib/actions/tickets';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMultiOptionsValue } from '@/utils/helper';

interface FormValues {
  fullName: string;
  role: string;
  customRole: string;
  expertise: string;
  topicsOfInterest: string[];
  sessionsOfInterest: string[];
}

const ClaimTickets = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ticketId = searchParams.get('ticketId');
    const token = searchParams.get('token');

    if (token == '' || !token || !ticketId) {
      router.push('/login');
    }
  }, []);

  const ticketInfo: { ticketId: string; token: string } | null = useMemo(() => {
    if (!searchParams) return null;
    const ticketId = searchParams.get('ticketId');
    const token = searchParams.get('token');

    if (!ticketId || !token) {
      return null;
    }
    return { ticketId, token };
  }, [searchParams]);

  const [showModal, setShowModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const initialValues: FormValues = {
    fullName: '',
    role: '',
    customRole: '',
    expertise: '',
    topicsOfInterest: [],
    sessionsOfInterest: [],
  };

  const schema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must be at most 50 characters'),
    role: Yup.string().required('Role is required'),
    customRole: Yup.string(),
    expertise: Yup.string().required('Expertise is required'),
    topicsOfInterest: Yup.array()
      .of(Yup.string())
      .required('Topics of interest are required')
      .min(1, 'Select at least one topic of interest')
      .max(5, 'Select at most five topics of interest'),
    sessionsOfInterest: Yup.array()
      .of(Yup.string())
      .required('Sessions of interest are required')
      .min(1, 'Select at least one session of interest')
      .max(3, 'Select at most three sessions of interest'),
  });

  const { mutateAsync: setUpProfile, isPending } = useMutation({
    mutationKey: [CacheKeys.CLAIM_TICKET],
    mutationFn: claimTicket,
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
    setUpProfile({
      ticket_id: ticketInfo?.ticketId as string,
      payload: {
        fullname: values.fullName,
        level_of_expertise: values.expertise,
        role: values.role || values.customRole,
        token: ticketInfo?.token as string,
        interests: values.topicsOfInterest,
        sessions: values.sessionsOfInterest,
      },
    })
      .then((res) => {
        console.log(res);
        setIsError(false);
        setTitle('Welcome to DevFest Lagos ‘24');
        setDescription(
          'Congratulations you have successfully registered for DevFest Lagos 2024. Log in to view your ticket details',
        );
        setShowModal(true);
      })
      .catch((err) => {
        setIsError(true);
        setTitle('Error');
        setDescription(err.response.data.message);
        setShowModal(true);
        console.error(err);
      });
  };

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
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ setFieldValue, isValid, values, errors }) => (
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
                    error={errors.fullName}
                  />
                  <Field
                    as={SelectField}
                    label='Role'
                    placeholder='Select'
                    options={roleOptions}
                    id='role'
                    onChange={(valueObj: OptionProp) => setFieldValue('role', valueObj.value)}
                    error={errors.role}
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
                      error={errors.customRole}
                    />
                  )}

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
                    label='Level of Expertise'
                    placeholder='Select'
                    options={expertiseOptions}
                    id='expertise'
                    onChange={(valueObj: OptionProp) => setFieldValue('expertise', valueObj.value)}
                    error={errors.expertise}
                  />

                  <Button
                    text='Register'
                    variant={isValid ? 'primary' : 'disabled'}
                    isLoading={isPending}
                  />
                </Form>
              )}
            </Formik>
            {
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={title}
                description={description}
                isError={isError}
                ctaFunc={() => router.push('/login')}
                ctaText='Log in'
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimTickets;
