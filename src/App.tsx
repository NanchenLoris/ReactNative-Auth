import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthNavigator } from './components/navigation/AuthNavigator';
import { RestApiAdapter } from './adapters/RestApiAdapter';
import { MainApp } from './MainApp'; // Your main app component

const authAdapter = new RestApiAdapter('https://api.example.com');

const App: React.FC = () => {
  return (
    <AuthProvider adapter={authAdapter}>
      <AuthNavigator>
        <MainApp />
      </AuthNavigator>
    </AuthProvider>
  );
};

export default App;