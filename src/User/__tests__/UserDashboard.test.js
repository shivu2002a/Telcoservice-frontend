import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDashboard from '../UserDashboard'; // Adjust path based on file structure

describe('UserDashboard Component', () => {
  it('renders navigation links correctly', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    // Check for "Services" link
    const servicesLinks = screen.getAllByText(/Services/i);
    expect(servicesLinks[0]).toBeInTheDocument(); // This targets the first "Services" link
    expect(servicesLinks[0]).toHaveAttribute('href', '/user/services');

    // Check for "My Services" link
    expect(screen.getByRole('link', { name: /My Services/i })).toHaveAttribute('href', '/user/subscribed-services');

    // Check for "My Requests" link
    expect(screen.getByRole('link', { name: /My Requests/i })).toHaveAttribute('href', '/user/pending-requests');
  });

  it('navigates to Services page when Services link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="user" element={<UserDashboard />}>
            <Route path="services" element={<div>Services Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const servicesLink = screen.getByRole('link', { name: 'Services' });
    fireEvent.click(servicesLink);

    // Check if the "Services Page" is rendered after clicking
    expect(screen.getByText('Services Page')).toBeInTheDocument();
  });

  it('navigates to My Services page when My Services link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="user" element={<UserDashboard />}>
            <Route path="subscribed-services" element={<div>My Services Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const myServicesLink = screen.getByRole('link', { name: 'My Services' });
    fireEvent.click(myServicesLink);

    // Check if the "My Services Page" is rendered after clicking
    expect(screen.getByText('My Services Page')).toBeInTheDocument();
  });

  it('navigates to My Requests page when My Requests link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="user" element={<UserDashboard />}>
            <Route path="pending-requests" element={<div>My Requests Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const myRequestsLink = screen.getByRole('link', { name: 'My Requests' });
    fireEvent.click(myRequestsLink);

    // Check if the "My Requests Page" is rendered after clicking
    expect(screen.getByText('My Requests Page')).toBeInTheDocument();
  });
});
