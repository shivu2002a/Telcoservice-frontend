import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import PendingRequests from '../PendingRequests';
import '@testing-library/jest-dom/extend-expect';

// Mock axios
jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPendingRequests = [
  {
    requestId: 1,
    userId: 123,
    serviceId: 456,
    serviceType: 'INTERNET_SERVICE',
    requestStatus: 'REQUESTED',
  },
];

const mockUserDetails = {
  username: 'Test User',
};

const mockServiceDetails = {
  serviceName: 'Test Service',
  criteria: 'Test Criteria',
  active: true,
  serviceType: 'INTERNET_SERVICE',
};

describe('PendingRequests Component', () => {
  beforeEach(() => {
    // Mock the axios get requests
    axios.get.mockImplementation((url) => {
      if (url === process.env.REACT_APP_BACKEND_URL+'/admin/api/approval-requests') {
        return Promise.resolve({ data: mockPendingRequests });
      }
      if (url.includes('userdetails')) {
        return Promise.resolve({ data: mockUserDetails });
      }
      if (url.includes('internet-services') || url.includes('tv-services')) {
        return Promise.resolve({ data: mockServiceDetails });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PendingRequests component', async () => {
    render(
      <BrowserRouter>
        <PendingRequests />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Pending Requests/i)).toBeInTheDocument());
  });

  test('displays error message if fetching requests fails', async () => {
    // Simulate an error response from axios
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch requests'))
    );

    render(
      <BrowserRouter>
        <PendingRequests />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Error: Failed to fetch requests/i)).toBeInTheDocument()
    );
  });
});
