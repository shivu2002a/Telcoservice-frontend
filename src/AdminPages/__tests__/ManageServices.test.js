import { render, screen } from '@testing-library/react';
import ManageServices from '../ManageServices';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios'); // Mock axios to prevent actual API calls

describe('ManageServices Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add Internet Service button', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ManageServices />
      </MemoryRouter>
    );

    // Wait for loading to finish
    expect(await screen.findByText('Add Internet Service')).toBeInTheDocument();
  });

  it('renders Add TV Service button', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ManageServices />
      </MemoryRouter>
    );

    // Wait for loading to finish
    expect(await screen.findByText('Add TV Service')).toBeInTheDocument();
  });
});
