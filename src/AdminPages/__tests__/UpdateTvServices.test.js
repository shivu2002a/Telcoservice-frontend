// UpdateTvServices.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateTvServices from '../UpdateTvServices';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the axios module
jest.mock('axios');

const mockServiceData = {
    serviceId: '1',
    serviceName: 'Basic TV',
    description: 'Basic TV service',
    serviceType: 'Cable',
    benefits: 'Access to local channels',
    cost: '300',
    criteria: 'None',
    validity: '30',
};

describe('UpdateTvServices', () => {
    test('renders the component and fetches TV service details', async () => {
        // Mock the API response
        axios.get.mockResolvedValueOnce({ data: mockServiceData });

        render(
            <MemoryRouter initialEntries={[{ pathname: '/update-tv-services', state: { serviceId: '1' } }]}>
                <Routes>
                    <Route path="/update-tv-services" element={<UpdateTvServices />} />
                </Routes>
            </MemoryRouter>
        );

        // Check loading state
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Wait for the service details to be rendered
        await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

        // Check if the service details are displayed
        expect(screen.getByDisplayValue(mockServiceData.serviceName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.description)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.cost)).toBeInTheDocument();
    });
});
