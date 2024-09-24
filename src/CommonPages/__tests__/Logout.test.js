import { render, waitFor } from '@testing-library/react';
import Logout from '../Logout'; // Adjust the import path accordingly
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock axios post
jest.mock('axios');

test('triggers logout and redirects on confirmation', async () => {
  // Mock the necessary props
  const mockSetIsUser = jest.fn();
  const mockSetIsAdmin = jest.fn();

  // Mock window.confirm to simulate confirmation
  window.confirm = jest.fn(() => true); // Simulate user clicking "OK" on the confirmation dialog

  // Mock axios post request for logout
  axios.post.mockResolvedValueOnce({ status: 200 });

  // Render the component
  render(
    <BrowserRouter>
      <Logout setIsUser={mockSetIsUser} setIsAdmin={mockSetIsAdmin} />
    </BrowserRouter>
  );

  // Wait for useEffect to run and for the confirmLogout function to be called
  await waitFor(() => {
    // Ensure window.confirm is called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to log out?');
    
    // Ensure axios.post is called for the logout API
    expect(axios.post).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL+'/logout', {}, { withCredentials: true });

    // Ensure user state is cleared
    expect(mockSetIsAdmin).toHaveBeenCalledWith(false);
    expect(mockSetIsUser).toHaveBeenCalledWith(false);

    // Ensure navigation to login occurs
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
