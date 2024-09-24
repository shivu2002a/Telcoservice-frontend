import React from 'react';
import { render, screen } from '@testing-library/react';
import Services from '../Services';
import '@testing-library/jest-dom'; // For the "toBeInTheDocument" matcher
import axios from 'axios';

// Mock necessary parts of the Services component
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

describe('Services Component', () => {
    test('should display loading message initially', () => {
        render(<Services />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('should display error message on fetch failure', async () => {
        // Mock axios to simulate an error
        axios.get.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        render(<Services />);
        // Wait for the component to update with the error message
        expect(await screen.findByText(/Error fetching services./i)).toBeInTheDocument();
    });
});
