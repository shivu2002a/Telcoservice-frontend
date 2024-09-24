import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import RequestsHistory from '../RequestsHistory';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

describe('RequestsHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders service details and user details correctly', async () => {
    // Mock response for pending requests
    axios.get.mockResolvedValueOnce({
      data: [
        {
          requestId: 1,
          serviceId: 101,
          userId: 1,
          serviceType: 'INTERNET_SERVICE',
          requestStatus: 'REQUESTED'
        }
      ]
    });

    // Mock response for user details
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { username: 'John Doe' }
      })
    );

    // Mock response for service details (internet service)
    axios.get.mockImplementation((url) => {
      if (url.includes('internet-services')) {
        return Promise.resolve({
          data: {
            serviceName: 'Super Internet Plan',
            criteria: 'High Speed',
            serviceType: 'INTERNET_SERVICE',
            active: false
          }
        });
      }
    });

    render(<RequestsHistory />);

    // Wait for the data to be rendered
    await waitFor(() => {
      // Check for the service name
      const serviceName = screen.getByText(/Super Internet Plan/i);
      expect(serviceName).toBeInTheDocument();

      // Check for the service type
      const serviceTypes = screen.getAllByText(/INTERNET_SERVICE/i);
      expect(serviceTypes.length).toBeGreaterThanOrEqual(1); // Adjust this if you expect more or fewer

      // Check for the user name
      const userName = screen.getByText(/John Doe/i);
      expect(userName).toBeInTheDocument();
    });
  });
});
