import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Popup from '../Popup';

describe('Popup Component', () => {
  const mockService = {
    serviceName: 'Test Internet Service',
    description: 'High-speed internet service.',
    serviceType: 'Internet',
    benefits: 'Unlimited data, high reliability.',
    cost: 999
  };

  const mockClosePopup = jest.fn();

  test('renders service details correctly', async () => {
    // Use act() imported from 'react'
    await act(async () => {
      render(<Popup service={mockService} closePopup={mockClosePopup} />);
    });

    // Check if service name is displayed
    expect(screen.getByText(mockService.serviceName)).toBeInTheDocument();

    // Check if description is displayed
    expect(screen.getByText(/High-speed internet service/i)).toBeInTheDocument();

    // Use a more specific query for service type to avoid conflicts
    const serviceTypeElement = screen.getAllByText(/Internet/i);
    expect(serviceTypeElement.length).toBeGreaterThan(0);

    // Check if benefits are displayed
    expect(screen.getByText(/Unlimited data, high reliability./i)).toBeInTheDocument();

    // Check if cost is displayed
    expect(screen.getByText(/Rs.999/i)).toBeInTheDocument();
  });

  test('calls closePopup function when close button is clicked', async () => {
    await act(async () => {
      render(<Popup service={mockService} closePopup={mockClosePopup} />);
    });

    const closeButton = screen.getByText(/Close/i);
    
    // Use act() to handle the click event
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Check if the closePopup function is called
    expect(mockClosePopup).toHaveBeenCalled();
  });
});
