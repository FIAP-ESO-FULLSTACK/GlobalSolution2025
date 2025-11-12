/**
 * @format
*/

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/Login';
import Home from './src/screens/Home';
import React, { useState, useEffect } from 'react';

let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage');
} catch {
  AsyncStorage = null;
}

if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
  console.warn('AsyncStorage native module not available, using in-memory fallback for storage (not persistent)');
  const _store: Record<string, string> = {};
  AsyncStorage = {
    getItem: async (key: string) => {
      return _store.hasOwnProperty(key) ? _store[key] : null;
    },
    setItem: async (key: string, value: string) => {
      _store[key] = value;
    },
    removeItem: async (key: string) => {
      delete _store[key];
    },
  };
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [user, setUser] = useState<any>(null);

  const STORAGE_KEY = 'lumigen_user';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUser(JSON.parse(raw));
        }
      } catch (err: any) {
        console.warn('Failed loading stored user', err);
      }
    };
    loadUser();
  }, []);

  const handleLoginSuccess = async (data: any) => {
    const toStore = data || { loggedIn: true };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (err: any) {
      console.warn('Failed saving user', err);
    }
    setUser(toStore);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      console.warn('Failed clearing user', err);
    }
    setUser(null);
  };

  const HomeComponent = Home as any;

  return (
    <View style={styles.container}>
      {user ? <HomeComponent user={user} onLogout={handleLogout} /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
