import Button from '@/components/button';
import MultiInput from '@/components/form/multiinput/MultiInput';
import { useEffect, useState } from 'react';
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
  const [saved, setSaved] = useState(defaultValue && defaultValue?.length > 0 ? true : false);
  const [pills, setPills] = useState<string[]>(defaultValue ?? []);

  const addPill = (value: string) => {
    const formerPills = pills;
    formerPills.push(value);
    if (value) {
      setPills(formerPills);
    }
  };

  const removePill = (index: number) => {
    const newPills = [...pills];
    newPills.splice(index, 1);
    setPills(newPills);
  };

  useEffect(() => {
    defaultValue && setPills(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (pills.length !== limit) {
      setSaved(false);
    }
  }, [limit]);

  return (
    <div className={styles.attendees} style={{ background: saved ? '#fffaeb' : 'transparent' }}>
      <h3>{title}</h3>

      {!saved && (
        <MultiInput
          pills={pills}
          onAddPill={addPill}
          onRemovePill={removePill}
          limit={limit}
          extraInformation='Kindly Press Enter after entering each email to add it to the list.'
        />
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
