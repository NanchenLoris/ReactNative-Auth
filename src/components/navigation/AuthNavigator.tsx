import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { TwoFactorForm } from '../forms/TwoFactorForm';
import { LoadingScreen } from '../common/LoadingScreen';

const Stack = createStackNavigator();

interface AuthNavigatorProps {
  children: React.ReactNode;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ children }) => {
  const { isAuthenticated, isLoading, requires2FA } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (requires2FA) {
    return <TwoFactorForm />;
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginForm} />
          <Stack.Screen name="Register" component={RegisterForm} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return <>{children}</>;
};