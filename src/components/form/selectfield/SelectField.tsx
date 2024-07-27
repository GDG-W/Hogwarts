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
}: SelectFieldProps | MultiSelectFieldProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<OptionProp[] | OptionProp | undefined>(
    isMulti ? (defaultValue as OptionProp[]) || [] : defaultValue,
  );
  const [searchValue, setSearchValue] = useState<string>('');

  const searchRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const handleInputClick = () => {
    if (!disabled) {
      setShowMenu(!showMenu);

      if (!showMenu && onOpen) {
        onOpen();
      }
    }
  };

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

    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    setSelectedValue(isMulti ? (defaultValue as OptionProp[]) || [] : defaultValue);
  }, [defaultValue, isMulti]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  return (
    <div className={styles.selectfield}>
      <label htmlFor={id}>
        <span>{label}</span>
        <span>{extraLabel}</span>
      </label>

      <div ref={inputRef} className={styles.select} id={id} onClick={handleInputClick}>
        {showMenu && (
          <div className={styles.menuWrapper}>
            {isSearchable && (
              <div>
                <input
                  className={styles.input}
                  onChange={onSearch}
                  value={searchValue}
                  ref={searchRef}
                  placeholder={searchPlaceholder ? searchPlaceholder : 'Search...'}
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
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
        <div>{getDisplay()}</div>
        {showMenu ? <ArrowUp /> : <ArrowDown />}
      </div>
    </div>
  );
};

export default SelectField;