import { RadioProps } from '../models';
import styles from './radio.module.scss';

const Radio = (props: RadioProps) => {
  const { label, name, id, ...others } = props;

  return (
    <div className={styles.radio}>
      <input type='radio' id={id} name={name} {...others} />

      <label htmlFor={id}>
        <span className={styles.radio_circle}></span>

        {label}
      </label>
    </div>
  );
};

export default Radio;
