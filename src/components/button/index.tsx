import React from 'react';
import { ButtonProps } from './models';
import styles from './button.module.scss';
import { classNames } from '@/utils/classNames';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  text,
  icon,
  outlined,
  fullWidth = false,
  onClick,
  ...others
}) => {
  const classes = classNames(
    styles.cta,
    variant == 'primary' && styles.primary,
    variant == 'secondary' && styles.secondary,
    variant == 'transparent' && styles.transparent,
    variant == 'disabled' && styles.disabled,
    fullWidth && styles.full_width,
    outlined && styles.outlined,
    others.className,
  );

  return (
    <button onClick={onClick} className={classes}>
      {text}
      {icon}
    </button>
  );
};

export default Button;
