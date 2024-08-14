import client from '../../axios';
import { InitiateSessionProps, SetUpProfileProps } from './models';

export const initiateSession = async (props: InitiateSessionProps) => {
  try {
    const { data } = await client.post('/users/sessions', props);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const { data } = await client.get('/users/profile', { data: token });

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const setUpProfile = async (props: SetUpProfileProps, ticket_id: string) => {
  try {
    const { data } = await client.post(`/users/:${ticket_id}/profiles`, props);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
