import apiClient from './api';

export interface ContactMessagePayload {
  name: string;
  type: 'query' | 'appreciation';
  email?: string;
  message: string;
}

export async function sendContactMessage(payload: ContactMessagePayload): Promise<any> {
  const response = await apiClient.post('/message/me', payload);
  return response.data;
}
