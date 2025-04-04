import api from './api';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from './firebaseConfig'; // Ispravljena putanja
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (data: { email: string; firstName: string; lastName: string; password: string }) => {
  try {
    console.log('Register data:', data); // Ispis podataka za registraciju
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    const err = error as any; // Cast error to any
    console.error('Register error:', err.response?.data || err.message); // Ispis greške
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    console.log('Login data:', data); // Ispis podataka za prijavu
    const response = await api.post('/auth/login', data);
    console.log('Login response:', response.data); // Ispis odgovora
    return response.data;
  } catch (error) {
    const err = error as any; // Cast error to any
    console.error('Login error:', err.response?.data || err.message); // Ispis greške
    throw error;
  }
};

export const googleLogin = async () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  if (response?.type === 'success') {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  }

  return null;
};

export const fetchProtectedRoute = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get('/protected-route', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};