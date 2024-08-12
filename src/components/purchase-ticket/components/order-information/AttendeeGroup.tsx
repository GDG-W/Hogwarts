import Button from '@/components/button';
import styles from './attendee.module.scss';
import MultiInput from '@/components/form/multiinput/MultiInput';
import { useState } from 'react';

const AttendeeGroup = ({ title, buttonText }: { title: string; buttonText: string }) => {
  const [pills, setPills] = useState<string[]>([]);

  const addPill = (value: string) => {
    if (value) {
      setPills([...pills, value]);
    }
  };

  const removePill = (index: number) => {
    const newPills = [...pills];
    newPills.splice(index, 1);
    setPills(newPills);
  };

  return (
    <div className={styles.attendees}>
      <h3>{title}</h3>

      <MultiInput pills={pills} onAddPill={addPill} onRemovePill={removePill} />
      <Button text={buttonText} variant='secondary' outlined={true} />
    </div>
  );
};

export default AttendeeGroup;
