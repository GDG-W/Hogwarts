import { ReactNode } from 'react';

export type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = {
  onClick?: () => void;
  icon?: string | ReactNode;
  outlined?: boolean;
  variant?: 'primary' | 'secondary' | 'transparent' | 'disabled';
  text: string;
  fullWidth?: boolean;
} & Props;
