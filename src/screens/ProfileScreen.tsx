import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login, register } from '../services/authService';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6; // Minimalna duljina lozinke
};

const ProfileScreen = () => {
  const { user, login: loginUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        loginUser({ email: userCredential.user.email, firstName: userCredential.user.displayName, lastName: '' }, 'google-token');
      }
    };

    handleGoogleLogin();
  }, [response]);

  const handleAuth = async () => {
    try {
      setErrorMessage('');
      if (!validateEmail(form.email)) {
        setErrorMessage('Invalid email format.');
        return;
      }
      if (!validatePassword(form.password)) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (isLogin) {
        const response = await login({ email: form.email, password: form.password });
        loginUser(response.user, response.token);
      } else {
        const response = await register(form);
        setIsLogin(true);
      }
    } catch (error) {
      if ((error as any).response?.status === 400) {
        setErrorMessage('Email already exists or the data is invalid.');
      } else if ((error as any).response?.status === 401) {
        setErrorMessage('Incorrect email or password.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      logout();
      setIsLogin(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.background, isDarkMode && styles.darkBackground]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
          {user ? (
            <>
              <Text style={[styles.title, isDarkMode && styles.darkText]}>
                Hello, {user.email}
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>
                  {isLogin ? 'Login' : 'Register'}
                </Text>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                {!isLogin && (
                  <>
                    <TextInput
                      placeholder="First Name"
                      placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                      value={form.firstName}
                      onChangeText={(text) => setForm({ ...form, firstName: text })}
                      style={[styles.input, isDarkMode && styles.darkInput]}
                    />
                    <TextInput
                      placeholder="Last Name"
                      placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                      value={form.lastName}
                      onChangeText={(text) => setForm({ ...form, lastName: text })}
                      style={[styles.input, isDarkMode && styles.darkInput]}
                    />
                  </>
                )}
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  style={[styles.input, isDarkMode && styles.darkInput]}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  secureTextEntry
                  style={[styles.input, isDarkMode && styles.darkInput]}
                />
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                  <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.switchButtonText}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>OR</Text>
                <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                  <Text style={styles.googleButtonText}>Login with Google</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <View style={styles.switchContainer}>
            <Text style={[styles.text, isDarkMode && styles.darkText]}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  darkContainer: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#666',
    color: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  switchButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;