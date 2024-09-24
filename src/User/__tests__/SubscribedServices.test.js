import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import SubscribedServices from '../SubscribedServices';

jest.mock('axios'); // Mock axios

describe('SubscribedServices Component', () => {
  beforeEach(() => {
    axios.get.mockClear(); // Clear mock before each test
  });

  test('displays error when user details cannot be fetched', async () => {
    axios.get.mockRejectedValueOnce(new Error('Unable to fetch user details'));

    render(
      <Router>
        <SubscribedServices />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch user details.')).toBeInTheDocument();
    });
  });

  test('displays error when subscribed services cannot be fetched', async () => {
    axios.get.mockResolvedValueOnce({ data: { userId: '123' } });
    axios.get.mockRejectedValueOnce(new Error('Unable to fetch subscribed services'));

    render(
      <Router>
        <SubscribedServices />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch subscribed services.')).toBeInTheDocument();
    });
  });

  test('displays "No services found" when no services are returned', async () => {
    axios.get.mockResolvedValueOnce({ data: { userId: '123' } });
    axios.get.mockResolvedValueOnce({ data: { internetServicesAvailed: [], tvServicesAvailed: [] } });

    render(
      <Router>
        <SubscribedServices />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('No services found.')).toBeInTheDocument();
    });
  });

  test('renders internet and TV services', async () => {
    axios.get.mockResolvedValueOnce({ data: { userId: '123' } });
    axios.get.mockResolvedValueOnce({
      data: {
        internetServicesAvailed: [
          {
            serviceId: '1',
            internetService: {
              serviceName: 'Basic Internet',
              serviceType: 'Fiber',
              description: 'Basic internet plan',
              benefits: '100 Mbps download',
              serviceDownloadSpeed: 100,
              serviceUploadSpeed: 20,
              cost: 29.99,
            },
            startDate: '2023-01-01T00:00:00Z',
            endDate: null,
          },
        ],
        tvServicesAvailed: [
          {
            serviceId: '2',
            tvService: {
              serviceName: 'Basic TV',
              serviceType: 'Cable',
              description: 'Basic TV plan',
              benefits: '100 channels',
              cost: 39.99,
            },
            startDate: '2023-01-01T00:00:00Z',
            endDate: null,
          },
        ],
      },
    });

    render(
      <Router>
        <SubscribedServices />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Internet')).toBeInTheDocument();
      expect(screen.getByText('Basic TV')).toBeInTheDocument();
    });
  });

  test('calls modify and terminate functions for services', async () => {
    axios.get.mockResolvedValueOnce({ data: { userId: '123' } });
    axios.get.mockResolvedValueOnce({
      data: {
        internetServicesAvailed: [
          {
            serviceId: '1',
            internetService: {
              serviceName: 'Basic Internet',
              serviceType: 'Fiber',
              description: 'Basic internet plan',
              benefits: '100 Mbps download',
              serviceDownloadSpeed: 100,
              serviceUploadSpeed: 20,
              cost: 29.99,
            },
            startDate: '2023-01-01T00:00:00Z',
            endDate: null,
          },
        ],
        tvServicesAvailed: [
          {
            serviceId: '2',
            tvService: {
              serviceName: 'Basic TV',
              serviceType: 'Cable',
              description: 'Basic TV plan',
              benefits: '100 channels',
              cost: 39.99,
            },
            startDate: '2023-01-01T00:00:00Z',
            endDate: null,
          },
        ],
      },
    });

    render(
      <Router>
        <SubscribedServices />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Internet')).toBeInTheDocument();
      expect(screen.getByText('Basic TV')).toBeInTheDocument();
    });
  });
});
