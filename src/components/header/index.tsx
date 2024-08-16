'use client';

import { classNames } from '@/utils/classNames';
import React from 'react';
import AnimatedLogo2 from '../logo/AnimatedLogo';
import styles from './header.module.scss';
import { HeaderProps } from './models';

const Header: React.FC<HeaderProps> = ({ navContent, className, handleClick }) => {
  return (
    <header className={classNames(styles.header, className)}>
      <a href='/'>
        <span className={styles.hidden}>Go to homepage</span>
        <AnimatedLogo2 width={120} height={35} />
      </a>
      {navContent && (
        <nav>
          <button type='button' onClick={handleClick}>
            {navContent}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
