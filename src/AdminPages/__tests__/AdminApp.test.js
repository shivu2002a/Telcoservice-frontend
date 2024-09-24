import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminApp from '../AdminApp';

// Mock the ProfileOverlay component
jest.mock('../ProfileOverlay', () => {
  return function MockProfileOverlay({ onClose, isSliding }) {
    return (
      <div data-testid="profile-overlay">
        <button onClick={onClose}>Close Profile</button>
      </div>
    );
  };
});

describe('AdminApp Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AdminApp />
      </MemoryRouter>
    );
  });

  it('renders navigation links', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Manage Services')).toBeInTheDocument();
    expect(screen.getByText('Manage Requests')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add Admin')).toBeInTheDocument();
  });

  it('opens and closes the profile overlay', async () => {
    // Open the profile overlay by clicking the profile icon
    fireEvent.click(screen.getByRole('img', { name: /admin profile/i }));

    // Verify that the profile overlay is opened
    expect(screen.getByTestId('profile-overlay')).toBeInTheDocument();

    // Close the profile overlay
    fireEvent.click(screen.getByRole('button', { name: /close profile/i }));

    // Wait for the profile overlay to be removed
    await waitFor(() => {
      expect(screen.queryByTestId('profile-overlay')).not.toBeInTheDocument();
    });
  });
});
