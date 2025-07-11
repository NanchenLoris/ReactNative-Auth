import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BiometricManager } from '../../utils/biometricManager';

interface LoginFormProps {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      // Error handled by context
    }
  };

  const handleBiometricLogin = async () => {
    const isSupported = await BiometricManager.isBiometricSupported();
    const isEnabled = await BiometricManager.isBiometricEnabled();

    if (!isSupported || !isEnabled) {
      Alert.alert('Error', 'Biometric authentication not available');
      return;
    }

    const success = await BiometricManager.authenticate('Login with biometrics');
    if (success) {
      // Implement biometric login logic here
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      clearError();
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      
    >
      <View >
        <Text >Welcome Back</Text>
        
        <TextInput
          
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <View >
          <TextInput
            
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity
            
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text >{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          
          onPress={handleBiometricLogin}
        >
          <Text >Use Biometric Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgotPassword}>
          <Text >Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSignUp}>
          <Text >Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};