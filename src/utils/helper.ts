import { OptionProp } from '@/components/form/models';
import { AxiosError } from 'axios';
import { SetStateAction } from 'react';

export const getOptionsValue = (value: string, options: OptionProp[]): OptionProp | undefined => {
  return options.find((opt) => opt.value == value || opt.label == value);
};

export function getMultiOptionsValue(values: string[], options: OptionProp[]): OptionProp[] {
  return options.filter((option) => values.includes(option.value));
}

export const handleError = (
  error: unknown,
  setFormError: React.Dispatch<SetStateAction<string>>,
) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      setFormError(error.response.data?.message || 'An error occurred');
    } else if (error.request) {
      setFormError('No response received from the server');
    } else {
      setFormError(error.message || 'An unknown Axios error occurred');
    }
  } else if (error instanceof Error) {
    setFormError(error.message || 'An unknown error occurred');
  } else {
    setFormError('An unexpected error occurred');
  }
};
