import styles from './order.module.scss';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@/components/form/textfield/TextField';
import SelectField from '@/components/form/selectfield/SelectField';
import { roleOptions, sizeOptions, expertiseOptions } from '@/utils/mock-data';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be at most 50 characters'),
  email: Yup.string().required('Email is required').email('Email is invalid'),
  role: Yup.string().required('Role is required'),
  expertLevel: Yup.string().required('Expertise level is required'),
  shirtSize: Yup.string().required('Shirt size is required'),
});

export const OrderInformation = () => {
  const initialValues = {
    fullName: '',
    email: '',
    isMyTicket: false,
    role: '',
    expertLevel: '',
    shirtSize: '',
  };

  return (
    <div className={styles.or_container}>
      <h3 className={styles.or_container_title}>Buyer Information</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log(values);
        }}
      >
        {({
          // touched,
          // errors,
          // handleBlur,
          handleSubmit,
          handleChange,
          values,
        }) => (
          <form className={styles.or_form} onSubmit={handleSubmit}>
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
                value={values.isMyTicket}
                onChange={handleChange}
              />
              This ticket belongs to me
            </label>

            {values.isMyTicket
              && <div className={`${styles.or_form} ${styles.inner_form}`}>
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

                <Field
                  as={SelectField}
                  name='role'
                  id='role'
                  label='Role'
                  placeholder='Select role'
                  options={roleOptions}
                  value={values.role}
                  onChange={handleChange}
                />

                <Field
                  as={SelectField}
                  name='expertLevel'
                  id='expertLevel'
                  label='Level of Expertise'
                  placeholder='Select expertise'
                  options={expertiseOptions}
                  value={values.expertLevel}
                  onChange={handleChange}
                />

                <Field
                  as={SelectField}
                  name='shirtSize'
                  id='shirtSize'
                  label='Shirt Size'
                  placeholder='Select shirt size'
                  options={sizeOptions}
                  value={values.expertLevel}
                  onChange={handleChange}
                />
              </div>
            }
          </form>
        )}
      </Formik>
    </div>
  );
};