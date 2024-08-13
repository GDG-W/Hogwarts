'use client';

import { classNames } from '@/utils/classNames';
import React from 'react';
// import AnimatedLogo from '../../../public/animated-devfest-logo.svg';
import styles from './header.module.scss';
import { HeaderProps } from './models';
import Image from 'next/image';

const Header: React.FC<HeaderProps> = ({ navContent, className, handleClick }) => {
  return (
    <header className={classNames(styles.header, className)}>
      <span>
        <Image
          src='/animated-devfest-logo.svg'
          alt='DevFest Lagos logo'
          width={118}
          height={34}
          priority={true}
        />
        {/* <AnimatedLogo /> */}
      </span>
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
