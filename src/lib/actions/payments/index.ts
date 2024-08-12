import client from '@/lib/axios';
import { TestAPIProps } from './models';

export const testAPICall = async (testAPIProps: TestAPIProps) => {
  try {
    const { data } = await client.post('/test/fetchDevFestAttendees', testAPIProps);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
