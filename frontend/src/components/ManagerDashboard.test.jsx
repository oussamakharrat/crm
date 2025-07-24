import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { ThemeProvider } from '../ThemeContext';
import { LogoProvider } from '../LogoContext';
import ManagerDashboard from './ManagerDashboard';

describe('ManagerDashboard', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', token: 'test-token', email: 'test@example.com', roles: ['manager'] }));
    localStorage.setItem('token', 'test-token');
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <LogoProvider>
          <AuthProvider>
            <ManagerDashboard />
          </AuthProvider>
        </LogoProvider>
      </ThemeProvider>
    );
  });
}); 