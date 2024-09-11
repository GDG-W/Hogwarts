import Button from '@/components/button';
import MultiInput from '@/components/form/multiinput/MultiInput';
import { useState } from 'react';
import styles from './attendee.module.scss';

const AttendeeGroup = ({
  title,
  handleSave,
  defaultValue,
  limit,
}: {
  title: string;
  buttonText: string;
  handleSave: (data: string[]) => void;
  defaultValue?: string[];
  limit?: number;
}) => {
  const [saved, setSaved] = useState(false);
  const [pills, setPills] = useState<string[]>(defaultValue ?? []);

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
    <div className={styles.attendees} style={{ background: saved ? '#fffaeb' : 'transparent' }}>
      <h3>{title}</h3>

      {!saved && (
        <MultiInput pills={pills} onAddPill={addPill} onRemovePill={removePill} limit={limit} />
      )}

      {/* Add Tooltip for the button to signify that the button gets disabled until the emails written is the same as the target limit */}

      <Button
        onClick={() => {
          if (pills.length <= 0) return;

          setSaved(!saved);
          handleSave(pills);
        }}
        text={saved ? 'Edit Information' : 'Save information'}
        variant={pills.length !== limit ? 'disabled' : 'secondary'}
        outlined={true}
        type='button'
        disabled={pills.length !== limit}
      />
    </div>
  );
};

export default AttendeeGroup;
