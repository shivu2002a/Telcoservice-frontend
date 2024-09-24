import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TvFeedback from '../TvFeedback'; // Adjust path as needed
import axios from 'axios';

jest.mock('axios');

const mockService = {
    serviceId: '123',
    startDate: '2024-01-01',
    tvService: { serviceName: 'Premium TV Package' }
};

// Helper function to render the component with MemoryRouter
const renderComponent = (initialState = mockService) => {
    return render(
        <MemoryRouter initialEntries={[{ pathname: '/tv-feedback', state: { service: initialState } }]}>
            <Routes>
                <Route path="/tv-feedback" element={<TvFeedback />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('TvFeedback Component', () => {
    test('renders component and displays service name', () => {
        renderComponent();

        expect(screen.getByText('Provide Feedback for Premium TV Package')).toBeInTheDocument();
    });

    test('updates feedback state on input change', () => {
        renderComponent();

        const textarea = screen.getByPlaceholderText('Enter feedback');
        fireEvent.change(textarea, { target: { value: 'Great service!' } });

        expect(textarea.value).toBe('Great service!');
    });

    test('submits feedback and handles service deactivation', async () => {
        axios.post.mockResolvedValue({});
        axios.delete.mockResolvedValue({});

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Great service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Confirm the modal
        await waitFor(() => fireEvent.click(screen.getByText('Yes')));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL+'/user/api/tv-service/feedback', null, {
                params: { availedServiceId: mockService.serviceId, feedback: 'Great service!' },
                withCredentials: true
            });
            expect(axios.delete).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL+'/user/api/tv-service', {
                params: { availedServiceId: mockService.serviceId, startDate: '2024-01-01' },
                withCredentials: true
            });
        });
    });

    test('shows error message on feedback submission failure', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Great service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Confirm the modal
        await waitFor(() => fireEvent.click(screen.getByText('Yes')));

        await waitFor(() => {
            expect(screen.getByText('Failed to submit feedback.')).toBeInTheDocument();
        });
    });

    test('shows error message on service deactivation failure', async () => {
        axios.post.mockResolvedValue({});
        axios.delete.mockRejectedValue(new Error('Network error'));

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Enter feedback'), { target: { value: 'Great service!' } });
        fireEvent.click(screen.getByText('Submit Feedback'));

        // Confirm the modal
        await waitFor(() => fireEvent.click(screen.getByText('Yes')));

        await waitFor(() => {
            expect(screen.getByText('Failed to terminate TV service.')).toBeInTheDocument();
        });
    });
});
