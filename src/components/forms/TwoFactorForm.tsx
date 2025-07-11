import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface TwoFactorFormProps {
  onBack?: () => void;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [otpMethod, setOtpMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const { verify2FA, sendOTP, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      await verify2FA(code);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleSendOTP = async (method: 'sms' | 'email') => {
    try {
      await sendOTP(method);
      setOtpMethod(method);
      setCountdown(30);
      Alert.alert('Success', `Code sent via ${method.toUpperCase()}`);
    } catch (error) {
      // Error handled by context
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Verification Failed', error);
      clearError();
    }
  }, [error]);

  return (
    <View >
      <View >
        <Text >Two-Factor Authentication</Text>
        <Text >
          Enter the 6-digit code from your authenticator app or received via SMS/Email
        </Text>
        
        <TextInput
          ref={inputRef}
          
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          onPress={handleVerify}
          disabled={isLoading || code.length !== 6}
        >
          <Text >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <View >
          <Text >Don't have access to your authenticator?</Text>
          
          <TouchableOpacity
            
            onPress={() => handleSendOTP('sms')}
            disabled={countdown > 0}
          >
            <Text >
              Send SMS Code {countdown > 0 ? `(${countdown}s)` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            
            onPress={() => handleSendOTP('email')}
            disabled={countdown > 0}
          >
            <Text >
              Send Email Code {countdown > 0 ? `(${countdown}s)` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onBack}>
          <Text >Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
