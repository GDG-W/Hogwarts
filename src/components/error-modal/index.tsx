import React from 'react';
import CloseIcon from '../../../public/close-icon.svg';
import Info from '../../../public/info.svg';
import Button from '../button';
import styles from './error_modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const ErrorModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button type='button' className={styles.closeButton} onClick={onClose}>
          <span className={styles.visuallyHidden}>Close</span>
          <CloseIcon />
        </button>
        <div className={styles.modalContent}>
          <Info />
          <div className={styles.modalText}>
            <h1>Checkout Successful</h1>
            {children}
          </div>
          <div className={styles.buttons}>
            <Button variant='primary' text='Ok' onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

// import React from 'react';
// import styles from './error_modal.module.scss';

// interface IModalProps {
//   show: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// const ErrorModal: React.FC<IModalProps> = ({ show, onClose, children }) => {
//   if (!show) {
//     return null;
//   }

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         {children}
//         <button onClick={onClose} className={styles.closeButton}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ErrorModal;
