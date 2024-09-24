import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import InternetFeedback from '../InternetFeedback'; // Adjust path as needed
import axios from 'axios';

jest.mock('axios');

const mockService = {
    serviceId: '456',
    startDate: '2024-02-01',
    internetService: { serviceName: 'Superfast Internet Package' }
};

describe('InternetFeedback Component', () => {
    test('renders component and displays service name', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/internet-feedback', state: { service: mockService } }]}>
                <Routes>
                    <Route path="/internet-feedback" element={<InternetFeedback />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Provide Feedback for Superfast Internet Package')).toBeInTheDocument();
    });

    test('updates feedback state on input change', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/internet-feedback', state: { service: mockService } }]}>
                <Routes>
                    <Route path="/internet-feedback" element={<InternetFeedback />} />
                </Routes>
            </MemoryRouter>
        );

        const textarea = screen.getByPlaceholderText('Enter feedback');
        fireEvent.change(textarea, { target: { value: 'Excellent service!' } });

        expect(textarea.value).toBe('Excellent service!');
    });

    test('submits feedback and handles service deactivation', async () => {
        axios.post.mockResolvedValue({});
        axios.delete.mockResolvedValue({});

        render(
            <MemoryRouter initialEntries={[{ pathname: '/internet-feedback', state: { service: mockService } }]}>
                <Routes>
                    <Route path="/internet-feedback" element={<InternetFeedback />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Excellent service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Simulate confirming the action in the confirmation modal
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL+'/user/api/internet-service/feedback', null, {
                params: { availedServiceId: mockService.serviceId, feedback: 'Excellent service!' },
                withCredentials: true
            });
            expect(axios.delete).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL+'/user/api/internet-service', {
                params: { availedServiceId: mockService.serviceId, startDate: '2024-02-01' },
                withCredentials: true
            });
        });
    });

    test('shows error message on feedback submission failure', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter initialEntries={[{ pathname: '/internet-feedback', state: { service: mockService } }]}>
                <Routes>
                    <Route path="/internet-feedback" element={<InternetFeedback />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Excellent service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Simulate confirming the action in the confirmation modal
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(screen.getByText('Failed to submit feedback or terminate the service.')).toBeInTheDocument();
        });
    });

    test('shows error message on service deactivation failure', async () => {
        axios.post.mockResolvedValue({});
        axios.delete.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter initialEntries={[{ pathname: '/internet-feedback', state: { service: mockService } }]}>
                <Routes>
                    <Route path="/internet-feedback" element={<InternetFeedback />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Excellent service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Simulate confirming the action in the confirmation modal
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(screen.getByText('Failed to terminate Internet service.')).toBeInTheDocument();
        });
    });
});
