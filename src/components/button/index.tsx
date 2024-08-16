import { classNames } from '@/utils/classNames';
import React from 'react';
import styles from './button.module.scss';
import { ButtonProps } from './models';

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
    <button onClick={onClick} {...others} className={classes}>
      {text}
      {icon}
    </button>
  );
};

export default Button;
