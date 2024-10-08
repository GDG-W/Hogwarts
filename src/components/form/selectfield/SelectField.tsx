import React, { useEffect, useRef, useState } from 'react';
import { SelectFieldProps, MultiSelectFieldProps, OptionProp } from '../models';
import ArrowUp from '../../../../public/select-arrow-up.svg';
import ArrowDown from '../../../../public/select-arrow-down.svg';
import styles from './selectfield.module.scss';
import { classNames } from '@/utils/classNames';

const SelectField = ({
  id,
  placeholder,
  options,
  extraLabel,
  isMulti = false,
  defaultValue,
  label,
  isSearchable,
  searchPlaceholder,
  disabled,
  onChange,
  onOpen,
  width,
  error,
}: SelectFieldProps | MultiSelectFieldProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<OptionProp[] | OptionProp | undefined>(
    isMulti ? (defaultValue as OptionProp[]) || [] : defaultValue,
  );
  const [searchValue, setSearchValue] = useState<string>('');

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleInputClick = () => {
    if (!disabled) {
      setShowMenu(!showMenu);

      if (!showMenu && onOpen) {
        onOpen();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInputClick();
    } else if (e.key === 'ArrowDown' && showMenu) {
      e.preventDefault();
      const firstItem = wrapperRef.current?.querySelector(`.${styles.menuItem}`);
      if (firstItem) {
        (firstItem as HTMLElement).focus();
      }
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getDisplay = (): React.ReactNode => {
    if (!selectedValue || (selectedValue as OptionProp[]).length === 0) {
      return <span className='text-light-text text-16'>{placeholder}</span>;
    }

    if (isMulti) {
      return (
        <div className={styles.multi}>
          {((selectedValue || []) as OptionProp[]).map((option) => (
            <div key={option.value} className={styles.multiItem}>
              {option.label}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onTagRemove(option);
                }}
                className={styles.pill}
              >
                | x
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (selectedValue as OptionProp).label;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    option: OptionProp,
    onItemClick: (option: OptionProp) => void,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onItemClick(option);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextSibling = (e.target as HTMLElement).nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousSibling = (e.target as HTMLElement).previousElementSibling;
      if (previousSibling) {
        (previousSibling as HTMLElement).focus();
      }
    }
  };

  const removeOption = (option: OptionProp): OptionProp[] => {
    return (selectedValue as OptionProp[]).filter((opt) => opt.value !== option.value);
  };

  const onTagRemove = (option: OptionProp) => {
    const newValue = removeOption(option);

    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (option: OptionProp) => {
    let newValue: OptionProp[] | OptionProp;

    if (isMulti) {
      if ((selectedValue as OptionProp[]).findIndex((opt) => opt.value === option.value) >= 0) {
        newValue = removeOption(option);
      } else {
        newValue = [...(selectedValue as OptionProp[]), option];
      }
    } else {
      newValue = option;
    }

    setSelectedValue(newValue);
    onChange(newValue);
    if (!isMulti) {
      setShowMenu(false);
    }
  };

  const isSelected = (option: OptionProp): boolean => {
    if (isMulti) {
      return (selectedValue as OptionProp[]).filter((o) => o.value === option.value).length > 0;
    }
    if (!selectedValue) {
      return false;
    }
    return (selectedValue as OptionProp).value === option.value;
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions = (): OptionProp[] => {
    if (!searchValue) {
      return options;
    }

    return options.filter(
      (option) => option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0,
    );
  };

  useEffect(() => {
    setSearchValue('');
  }, [showMenu]);

  useEffect(() => {
    setSelectedValue(isMulti ? (defaultValue as OptionProp[]) || [] : defaultValue);
  }, [defaultValue, isMulti]);

  return (
    <div style={{ width }} className={styles.selectfield}>
      <label htmlFor={id}>
        <span>{label}</span>
        <span>{extraLabel}</span>
      </label>

      <div className={styles.selectWrapper} ref={wrapperRef}>
        <div
          className={classNames(styles.select, disabled && styles.disabled)}
          id={id}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          tabIndex={0}
          role='button'
          aria-haspopup='listbox'
          aria-expanded={showMenu}
          aria-disabled={disabled}
        >
          <div>{getDisplay()}</div>
          {showMenu ? <ArrowUp /> : <ArrowDown />}
        </div>
        {showMenu && (
          <div className={styles.menuWrapper} role='listbox' tabIndex={-1}>
            {isSearchable && (
              <div>
                <input
                  className={styles.input}
                  onChange={onSearch}
                  value={searchValue}
                  placeholder={searchPlaceholder ? searchPlaceholder : 'Search...'}
                  aria-label={searchPlaceholder ? searchPlaceholder : 'Search...'}
                />
              </div>
            )}

            {getOptions().map((option) => (
              <div
                key={option.value}
                className={classNames(styles.menuItem, isSelected(option) && styles.selected)}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(option);
                }}
                onKeyDown={(e) => handleKeyDown(e, option, onItemClick)}
                tabIndex={0}
                role='option'
                aria-selected={isSelected(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
};

export default SelectField;
