import { getServerSession as nextAuthGetServerSession } from 'next-auth';
import { authOptions } from './auth';

// This version is safe to use in components
export async function getServerSession() {
  try {
    return await nextAuthGetServerSession(authOptions);
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}