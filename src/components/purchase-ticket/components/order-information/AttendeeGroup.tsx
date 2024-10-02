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
    setPills((prevPills) => [...prevPills, value]);
  };

  const removePill = (index: number) => {
    setPills((prevPills) => {
      const newPills = [...prevPills];
      newPills.splice(index, 1);
      return newPills;
    });
  };

  const handlePillsChange = (newPills: string[]) => {
    setPills(newPills);
  };

  useEffect(() => {
    defaultValue && setPills(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (pills.length !== limit) {
      setSaved(false);
    }
  }, [pills, limit]);

  return (
    <div className={styles.attendees} style={{ background: saved ? '#fffaeb' : 'transparent' }}>
      <h3>{title}</h3>

      {!saved && (
        <MultiInput
          pills={pills}
          onAddPill={addPill}
          onRemovePill={removePill}
          onPillsChange={handlePillsChange}
          limit={limit}
          extraInformation='Kindly Press Enter after entering each email to add it to the list.'
        />
      )}

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
