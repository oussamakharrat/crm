import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import { ThemeProvider } from '../ThemeContext';
import { LogoProvider } from '../LogoContext';
import LeadDetails from './LeadDetails';

describe('LeadDetails', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', token: 'test-token', email: 'test@example.com' }));
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
              <LeadDetails />
            </AuthProvider>
          </LogoProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  });
}); 