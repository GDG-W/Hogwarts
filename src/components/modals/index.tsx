import React from 'react';
import CloseIcon from '../../../public/close-icon.svg';
import Notification from '../../../public/sms-notification.svg';
import Button from '../button';
import styles from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
            <h1>Registration Successful</h1>
            <p>
              You have successfully registered for Devfest Lagos 2024. Check your email for your
              Ticket ID.
            </p>
          </div>
          <div className={styles.buttons}>
            <Button variant='primary' text='Ok' onClick={onClose} />
            <Button variant='transparent' text='Upgrade Ticket' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
