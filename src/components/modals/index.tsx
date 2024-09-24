import React from 'react';
import CloseIcon from '../../../public/close-icon.svg';
import Notification from '../../../public/sms-notification.svg';
import Button from '../button';
import styles from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  isError?: boolean;
  ctaFunc?: () => void;
  ctaText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  isError,
  ctaFunc,
  ctaText,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type='button' className={styles.closeButton} onClick={onClose}>
          <span className={styles.visuallyHidden}>Close</span>
          <CloseIcon />
        </button>
        <div className={styles.modalContent}>
          <Notification />
          <div className={styles.modalText}>
            <h1 className={isError ? styles.error : ''}>{title}</h1>
            <p>{description}</p>
          </div>
          <div className={styles.buttons}>
            {isError ? (
              <Button variant='primary' text='Retry' onClick={onClose} />
            ) : (
              <Button variant='primary' text={ctaText} onClick={ctaFunc} />
            )}
            {/* {!isError && <Button variant='transparent' text='Upgrade Ticket' />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
