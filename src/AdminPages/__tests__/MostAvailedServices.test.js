import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MostAvailedServices from '../MostAvailedServices'; // Adjust the import path as necessary

jest.mock('axios');

describe('MostAvailedServices Component', () => {
  it('displays internet and TV services data when fetched successfully', async () => {
    // Mocking successful API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('most-availed-internet-services')) {
        return Promise.resolve({
          data: [
            { serviceName: 'Fiber Internet', serviceType: 'Internet', subscribedCount: 100 },
            { serviceName: 'Cable Internet', serviceType: 'Internet', subscribedCount: 80 },
          ],
        });
      }
      if (url.includes('most-availed-tv-services')) {
        return Promise.resolve({
          data: [
            { serviceName: 'Premium Cable', serviceType: 'TV', subscribedCount: 120 },
            { serviceName: 'Basic Cable', serviceType: 'TV', subscribedCount: 60 },
          ],
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<MostAvailedServices />);

    // Check that loading messages are displayed initially
    expect(screen.getByText(/Loading internet services data.../i)).toBeInTheDocument();
    expect(screen.getByText(/Loading TV services data.../i)).toBeInTheDocument();

    // Wait for loading messages to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading internet services data.../i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Loading TV services data.../i)).not.toBeInTheDocument();
    });

    // Check that charts are displayed with the correct data
    expect(screen.getByText('Most Availed Internet Services')).toBeInTheDocument();
    expect(screen.getByText('Most Availed TV Services')).toBeInTheDocument();
  });
});
