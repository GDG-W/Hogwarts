'use client';

import { CancelIcon } from '@/assets/svg';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './modallayout.module.scss';

interface IModalProps {
  children: JSX.Element;
  onClose: () => void;
  showModal: boolean;
  width?: 'sm' | 'md' | 'full';
  showHeader?: boolean;
}
export interface IBaseModalProps {
  modalTrigger: boolean;
  handleClose: () => void;
}

export function ModalLayout(props: IModalProps) {
  const { children, onClose, showModal, width, showHeader } = props;

  const [showModalCard, setShowModalCard] = useState(showModal);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  const handleBackground = () => {
    if (showModal) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    }

    if (!showModal) {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  useEffect(() => {
    handleBackground();

    if (showModal) {
      gsap.to(modalContainerRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.2,
      });
      gsap.to(modalCardRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    } else {
      gsap.to(modalContainerRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.2,
      });
      gsap.to(modalCardRef.current, {
        scale: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setShowModalCard(false);
          onClose();
        },
      });
    }
  }, [showModal, onClose]);

  const m_width = width === 'sm' ? styles.w_sm : width === 'md' ? styles.w_md : styles.w_full;

  return (
    <div
      ref={modalContainerRef}
      className={`${styles.modalContainer} ${showModalCard ? styles.visible : styles.hidden}`}
      onClick={() => {
        gsap.to(modalCardRef.current, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setShowModalCard(false);
            onClose();
          },
        });
      }}
    >
      <div
        ref={modalCardRef}
        onClick={(e) => e.stopPropagation()}
        className={`${styles.modalCard} ${m_width} ${showModalCard ? styles.visible : styles.hidden}`}
      >
        {showHeader && (
          <div className={styles.modal_header}>
            <div className={styles.top_pop}>
              <Image
                src='/animated-devfest-logo.svg'
                alt='DevFest Lagos logo'
                width={132}
                height={34}
                priority={true}
              />
            </div>

            <div className={styles.top_pop}>
              <div className={styles.cancel_text} onClick={onClose}>
                <span className={styles.cancel_text_name}> Cancel Purchase </span>
                <CancelIcon />
              </div>
            </div>
          </div>
        )}

        <div className={styles.modal_content}>{children}</div>
      </div>
    </div>
  );
}
