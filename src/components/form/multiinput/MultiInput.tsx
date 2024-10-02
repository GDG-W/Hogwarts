import React, { useRef, useState, useEffect } from 'react';
import InfoCircle from '../../../../public/info-circle.svg';
import styles from './mulitinput.module.scss';

interface PillInputProps {
  pills: string[];
  onAddPill: (value: string) => void;
  onRemovePill: (index: number) => void;
  onPillsChange: (newPills: string[]) => void;
  limit?: number;
  extraInformation?: string;
}

const MultiInput: React.FC<PillInputProps> = ({
  pills,
  onAddPill,
  onRemovePill,
  onPillsChange,
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

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && isValidEmail(trimmedEmail) && !pills.includes(trimmedEmail)) {
      if (limit && pills.length >= limit) {
        setErrorMessage('Email Limit Reached');
        return false;
      }
      onAddPill(trimmedEmail);
      return true;
    }
    return false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const trimmedValue = inputValue.trim();

      if (limit && pills.length >= limit) {
        return setErrorMessage('Email Limit Reached');
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
      return setErrorMessage('Email Limit Reached');
    }

    setInputValue(event.target.value);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('Text');
    const emails = pastedText.split(/[\s,;]+/).filter((email) => email.trim() !== '');

    let addedCount = 0;
    const invalidEmails = [];
    const newPills = [...pills];

    for (const email of emails) {
      if (addEmail(email)) {
        addedCount++;
        newPills.push(email.trim());
      } else if (email.trim()) {
        invalidEmails.push(email);
      }
    }

    if (invalidEmails.length > 0) {
      setErrorMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
    } else if (addedCount > 0) {
      setErrorMessage('');
    }

    setInputValue('');
    onPillsChange(newPills); // Note: This notifies parent component about the change
  };

  const handleBlur = () => {
    if (pills.length > 0) {
      inputRef.current!.placeholder = '';
    }
  };

  useEffect(() => {
    onPillsChange(pills);
  }, [pills, onPillsChange]);

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
          onPaste={handlePaste}
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
