import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import PendingRequestStatus from '../PendingRequestStatus';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('PendingRequestStatus Component', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockedAxios.get.mockClear();
    });

    test('renders component and displays header', async () => {
        await act(async () => {
            render(<PendingRequestStatus />, { wrapper: MemoryRouter });
        });
        expect(screen.getByText('Service Requests')).toBeInTheDocument();
    });

    test('displays "No requested requests found." when there are no pending requests', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { userId: 'user123' } });
        mockedAxios.get.mockResolvedValueOnce({ data: [] });  // No pending requests

        await act(async () => {
            render(<PendingRequestStatus />, { wrapper: MemoryRouter });
        });

        await waitFor(() => expect(screen.getByText('No requested requests found.')).toBeInTheDocument());
    });

    test('displays a list of pending requests when they are available', async () => {
        // Mock user ID request
        mockedAxios.get.mockResolvedValueOnce({ data: { userId: 'user123' } });

        // Mock pending requests
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { requestId: 'req1', requestStatus: 'Pending', serviceId: 'srv1', serviceType: 'INTERNET_SERVICE' },
                { requestId: 'req2', requestStatus: 'In Progress', serviceId: 'srv2', serviceType: 'TV_SERVICE' }
            ]
        });

        // Mock service details
        mockedAxios.get.mockResolvedValueOnce({
            data: { serviceId: 'srv1', serviceName: 'High-Speed Internet', benefits: ['Fast', 'Reliable'], description: 'High-speed internet service' }
        });
        mockedAxios.get.mockResolvedValueOnce({
            data: { serviceId: 'srv2', serviceName: 'Premium TV', benefits: ['HD Channels'], description: 'Premium TV service with HD channels' }
        });

        await act(async () => {
            render(<PendingRequestStatus />, { wrapper: MemoryRouter });
        });

        // Wait for the first request to appear and assert its content
        await waitFor(() => expect(screen.getByText('High-Speed Internet')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Fast, Reliable')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('High-speed internet service')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Pending')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('INTERNET_SERVICE')).toBeInTheDocument());

        // Wait for the second request to appear and assert its content
        await waitFor(() => expect(screen.getByText('Premium TV')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('HD Channels')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Premium TV service with HD channels')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('In Progress')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('TV_SERVICE')).toBeInTheDocument());
    });
});
