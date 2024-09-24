import React, { useRef, useState } from 'react';
import styles from './mulitinput.module.scss';
import InfoCircle from '../../../../public/info-circle.svg';

interface PillInputProps {
  pills: string[];
  onAddPill: (value: string) => void;
  onRemovePill: (index: number) => void;
  limit?: number;
  extraInformation?: string;
}

const MultiInput: React.FC<PillInputProps> = ({
  pills,
  onAddPill,
  onRemovePill,
  limit,
  extraInformation,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const trimmedValue = inputValue.trim();

      if (limit && pills.length >= limit) {
        return setErrorMessage('Email Limit');
      }

      if (!trimmedValue) {
        setErrorMessage('Please enter an email address.');
      } else if (!isValidEmail(trimmedValue)) {
        setErrorMessage('Please enter a valid email address.');
      } else if (pills.some((pill) => pill.toLowerCase() === trimmedValue.toLowerCase())) {
        setErrorMessage('This email has already been added.');
      } else {
        onAddPill(trimmedValue);
        setInputValue('');
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (limit && pills.length >= limit) {
      return setErrorMessage('Email Limit');
    }

    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    if (pills.length > 0) {
      inputRef.current!.placeholder = '';
    }
  };

  // const handleFocus = () => {
  //   if (pills.length > 0) {
  //     inputRef.current!.placeholder = 'Enter recipient email(s)';
  //   }
  // };

  return (
    <div>
      <div className={styles.pillInputContainer}>
        <div className={styles.pillContainer}>
          {pills.map((pill, index) => (
            <div key={index} className={styles.pill}>
              {pill}
              <span className={styles.close} onClick={() => onRemovePill(index)}>
                | ×
              </span>
            </div>
          ))}
        </div>
        <input
          type='text'
          className={styles.pillInput}
          placeholder={pills.length > 0 ? '' : 'Enter recipient email(s)'}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          // onFocus={handleFocus}
          ref={inputRef}
        />
      </div>
      {extraInformation && (
        <div className={styles.extra}>
          <InfoCircle />
          <p>{extraInformation}</p>
        </div>
      )}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export default MultiInput;
