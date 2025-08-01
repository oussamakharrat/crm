import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import { ThemeProvider } from '../ThemeContext';
import { LogoProvider } from '../LogoContext';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', token: 'test-token', email: 'test@example.com', roles: ['admin'] }));
    localStorage.setItem('token', 'test-token');
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LogoProvider>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </LogoProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  });
}); 