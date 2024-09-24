// src/User/__tests__/ModifyTvSubscription.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ModifyTvSubscription from '../ModifyTvSubscription'; // Adjust path if necessary

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('ModifyTvSubscription Component Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mocks before each test
    });

    it('renders correctly and handles API responses', async () => {
        // Mock API responses
        mockedAxios.get.mockImplementation((url) => {
            if (url === process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser') {
                return Promise.resolve({ data: { userId: 1 } });
            }
            if (url === process.env.REACT_APP_BACKEND_URL+'/user/api/subscribed-services') {
                return Promise.resolve({
                    data: {
                        tvServicesAvailed: [
                            {
                                tvService: { serviceName: 'TestService', serviceType: 'Basic', serviceId: '1' },
                                startDate: '2023-01-01'
                            }
                        ]
                    }
                });
            }
            if (url === process.env.REACT_APP_BACKEND_URL+'/user/api/tv-service/other') {
                return Promise.resolve([{ serviceId: '2', serviceName: 'NewService', serviceType: 'Premium' }]);
            }
            return Promise.reject(new Error('Not Found'));
        });

        // Render the component inside MemoryRouter
        render(
            <MemoryRouter initialEntries={['/?serviceName=TestService']} >
                <ModifyTvSubscription />
            </MemoryRouter>
        );

        // Assertions
        await waitFor(() => {
            expect(screen.getByText('Modify TV Subscription')).toBeInTheDocument();
        });
    });

    it('displays error message on API failure', async () => {
        // Mock API responses to simulate an error
        mockedAxios.get.mockImplementation((url) => {
            if (url === process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser') {
                return Promise.resolve({ data: { userId: 1 } });
            }
            if (url === process.env.REACT_APP_BACKEND_URL+'/user/api/subscribed-services') {
                return Promise.resolve({ data: { tvServicesAvailed: [] } });
            }
            return Promise.reject(new Error('Not Found'));
        });

        // Render the component inside MemoryRouter
        render(
            <MemoryRouter initialEntries={['/?serviceName=TestService']} >
                <ModifyTvSubscription />
            </MemoryRouter>
        );

        // Assert that the error message is displayed
        await waitFor(() => {
            expect(screen.getByText('No services available for modification.')).toBeInTheDocument();
        });
    });
});
