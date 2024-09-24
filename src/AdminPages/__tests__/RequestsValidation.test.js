import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequestsValidation from '../RequestsValidation'; // Adjust the path as necessary
import axios from 'axios';

// Mock the axios module
jest.mock('axios');

describe('RequestsValidation Component', () => {
    const mockService = {
        serviceName: 'Fast Internet',
        active: true,
        serviceType: 'INTERNET_SERVICE',
        criteria: 'Must be a resident.',
        description: 'High-speed internet service.',
        serviceDownloadSpeed: 100,
        serviceUploadSpeed: 20,
        validity: 30,
        cost: 999,
    };

    const mockUser = {
        username: 'john_doe',
        email: 'john@example.com',
        phonenumber: '1234567890',
        address: 'h.no: 123, street: Elm, city: Springfield, state: IL, pincode: 12345',
    };

    const mockRequest = {
        requestId: 'req123',
        userId: 'user123',
        serviceType: 'INTERNET_SERVICE',
    };

    const setup = () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/requests-validation', state: { user: mockUser, service: mockService, request: mockRequest } }]}>
                <Routes>
                    <Route path="/requests-validation" element={<RequestsValidation />} />
                </Routes>
            </MemoryRouter>
        );
    };

    test('disapprove button is disabled when remarks are empty', () => {
        setup();
        expect(screen.getByText(/disapprove/i)).toBeDisabled();
    });

    test('enables disapprove button when remarks are filled', () => {
        setup();
        const remarksInput = screen.getByLabelText(/remarks/i);
        fireEvent.change(remarksInput, { target: { value: 'Not meeting criteria' } });
        expect(screen.getByText(/disapprove/i)).not.toBeDisabled();
    });
});
