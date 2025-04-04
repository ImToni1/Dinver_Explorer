import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>Home Screen</Text>
      <Text style={[styles.modeText, isDarkMode && styles.darkModeText]}>
        Currently in {isDarkMode ? 'Dark' : 'Light'} Mode
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  modeText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  darkModeText: {
    color: '#aaa',
  },
});

export default HomeScreen;