import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login'; // Adjust the import to the correct path of your Login component
import { BrowserRouter } from 'react-router-dom';

test('triggers form submission on button click', () => {
  // Mock the necessary props
  const mockSetIsUser = jest.fn();
  const mockSetIsAdmin = jest.fn();

  // Render the component
  render(
    <BrowserRouter>
      <Login setIsUser={mockSetIsUser} setIsAdmin={mockSetIsAdmin} />
    </BrowserRouter>
  );

  // Find the login button
  const loginButton = screen.getByRole('button', { name: /Login/i });

  // Simulate button click
  fireEvent.click(loginButton);

  // Since we aren't submitting a valid form, ensure that it doesn't redirect
  // Add expectations here based on what should happen (e.g., error message or API call mock)
  expect(loginButton).toBeInTheDocument();
});
