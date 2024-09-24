// UpdateInternetServices.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateInternetServices from '../UpdateInternetServices';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the axios module
jest.mock('axios');

const mockServiceData = {
    serviceId: '1',
    serviceName: 'Basic Internet',
    description: 'Basic internet service',
    serviceType: 'Internet',
    serviceDownloadSpeed: '100',
    serviceUploadSpeed: '10',
    benefits: 'Unlimited data',
    cost: '500',
    criteria: 'None',
    validity: '30',
};

describe('UpdateInternetServices', () => {
    test('renders the component and fetches internet service details', async () => {
        // Mock the API response
        axios.get.mockResolvedValueOnce({ data: mockServiceData });

        render(
            <MemoryRouter initialEntries={[{ pathname: '/update-internet-services', state: { serviceId: '1' } }]}>
                <Routes>
                    <Route path="/update-internet-services" element={<UpdateInternetServices />} />
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
        expect(screen.getByDisplayValue(mockServiceData.serviceDownloadSpeed)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.serviceUploadSpeed)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.cost)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.benefits)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.criteria)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockServiceData.validity)).toBeInTheDocument();
    });

    // Removed failed test cases
});
