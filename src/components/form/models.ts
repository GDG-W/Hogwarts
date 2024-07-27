import { ReactNode } from 'react';

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export type OptionProp = {
  label: string;
  value: string;
};

export type TextFieldProps = {
  type?: string;
  id?: string;
  label: string;
  extraLabel?: string;
  placeholder: string;
  bottomLeft?: string | ReactNode;
  bottomRight?: string;
};

export interface SelectFieldProps {
  id: string;
  placeholder: string;
  options: OptionProp[];
  extraLabel?: string;
  isMulti?: boolean;
  isLoading?: boolean;
  defaultValue?: OptionProp;
  label?: string;
  labelStyles?: React.CSSProperties;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  error?: string;
  extra?: string;
  disabled?: boolean;
  isRequired?: boolean;
  onChange: (value: OptionProp | OptionProp[]) => void;
  onOpen?: () => void;
}

export interface MultiSelectFieldProps extends Omit<SelectFieldProps, 'defaultValue'> {
  defaultValue?: OptionProp[];
}