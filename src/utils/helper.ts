import { OptionProp } from '@/components/form/models';

export const getOptionsValue = (value: string, options: OptionProp[]): OptionProp | undefined => {
  return options.find((opt) => opt.value == value || opt.label == value);
};
