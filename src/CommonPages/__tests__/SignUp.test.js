// src/CommonPages/__tests__/SignUp.test.js
import { render, screen } from '@testing-library/react';
import SignUp from '../SignUp';
import { BrowserRouter } from 'react-router-dom';

test('renders SignUp component with title and submit button', () => {
  // Render SignUp component within BrowserRouter context
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );

  // Debug output to help find the issue
  screen.debug(); // This will print the HTML structure to the console

  // Check if the form title is present
  const title = screen.getByRole('heading', { name: /Sign Up/i });
  expect(title).toBeInTheDocument(); // Assert that the title is in the document

  // Check if the submit button is present
  const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  expect(submitButton).toBeInTheDocument(); // Assert that the submit button is in the document
});
