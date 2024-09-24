import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServicesList from '../ServicesList'; // Adjust the path as needed

describe('ServicesList Component', () => {
  const mockServices = [
    {
      serviceId: 1,
      serviceName: 'Internet Plan',
      serviceType: 'internet',
      description: 'High-speed internet',
      cost: 500,
      validity: 30,
    },
    {
      serviceId: 2,
      serviceName: 'TV Plan',
      serviceType: 'tv',
      description: 'Premium channels',
      cost: 300,
      validity: 30,
    },
  ];

  const mockModify = jest.fn();
  const mockTerminate = jest.fn();
  const mockHandleServiceClick = jest.fn();
  const mockOnViewMore = jest.fn();
  const mockOnShowLess = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls handleServiceClick when a service box is clicked', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={true}
        serviceType="internet"
      />
    );

    fireEvent.click(screen.getByText('Internet Plan'));
    expect(mockHandleServiceClick).toHaveBeenCalledWith(mockServices[0]);

    fireEvent.click(screen.getByText('TV Plan'));
    expect(mockHandleServiceClick).toHaveBeenCalledWith(mockServices[1]);
  });

  test('calls onModify when Modify button is clicked', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={true}
        serviceType="internet"
      />
    );

    fireEvent.click(screen.getAllByText('Modify')[0]);
    expect(mockModify).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getAllByText('Modify')[1]);
    expect(mockModify).toHaveBeenCalledWith(2);
  });

  test('calls onTerminate when Terminate button is clicked', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={true}
        serviceType="internet"
      />
    );

    fireEvent.click(screen.getAllByText('Terminate')[0]);
    expect(mockTerminate).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getAllByText('Terminate')[1]);
    expect(mockTerminate).toHaveBeenCalledWith(2);
  });

  test('displays "View More" when hasMore is true', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={true}
        serviceType="internet"
      />
    );

    expect(screen.getByText('View More')).toBeInTheDocument();
  });

  test('displays "Show Less" when hasMore is false', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={false}
        serviceType="internet"
      />
    );

    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  test('calls onViewMore when "View More" button is clicked', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={true}
        serviceType="internet"
      />
    );

    fireEvent.click(screen.getByText('View More'));
    expect(mockOnViewMore).toHaveBeenCalled();
  });

  test('calls onShowLess when "Show Less" button is clicked', () => {
    render(
      <ServicesList
        services={mockServices}
        onModify={mockModify}
        onTerminate={mockTerminate}
        handleServiceClick={mockHandleServiceClick}
        onViewMore={mockOnViewMore}
        onShowLess={mockOnShowLess}
        hasMore={false}
        serviceType="internet"
      />
    );

    fireEvent.click(screen.getByText('Show Less'));
    expect(mockOnShowLess).toHaveBeenCalled();
  });
});
