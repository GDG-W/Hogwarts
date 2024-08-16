import styles from './button.module.scss';

export const ButtonLoader = () => {
  return <div className={styles.button_loader}></div>;
};

export const BlackButtonLoader = () => {
  return <div className={styles.colored_button_loader}></div>;
};
