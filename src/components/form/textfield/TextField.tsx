import React from 'react';
import { TextFieldProps } from '../models';
import styles from './textfield.module.scss';
import { classNames } from '@/utils/classNames';

const TextField = ({
  id,
  label,
  type,
  extraLabel,
  placeholder,
  bottomLeft,
  bottomRight,
  width,
  onChange,
  value,
  // disabled,
  ...inputProps
}: TextFieldProps) => {
  return (
    <div className={classNames(styles.textfield)}>
      <label htmlFor={id}>
        <span>{label}</span>
        <span>{extraLabel}</span>
      </label>
      <input
        {...inputProps}
        className={inputProps.disabled ? styles.disabled : ''}
        onChange={onChange}
        value={value}
        style={{ width }}
        type={type}
        id={id}
        placeholder={placeholder}
      />
      {(bottomLeft || bottomRight) && (
        <div className={styles.extra}>
          <div className={styles.left}>{bottomLeft}</div>
          {bottomRight && (
            <a className={styles.right} href=''>
              {bottomRight}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TextField;
