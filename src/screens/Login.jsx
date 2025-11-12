import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity, 
} from 'react-native';

import { login } from '../services/auth';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      setLoading(false);
      
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(data);
      }

      Alert.alert('Sucesso!', 'Login realizado!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro no Login', error.message || 'Não foi possível conectar.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Image.png')} 
        style={styles.headerImage}
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#666', 
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: 200, 
    height: 150, 
    alignSelf: 'center', 
    marginBottom: 30, 
    resizeMode: 'contain', 
  },
  button: {
    backgroundColor: '#000000', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,  
    alignSelf: 'center',
    paddingHorizontal: 60, 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;