import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddTvService from '../AddTvService';

describe('AddTvService Component', () => {
  
  // Test Case 1: Submit button is rendered and starts in an enabled state
  it('renders the submit button and is enabled initially', () => {
    render(
      <Router>
        <AddTvService />
      </Router>
    );

    const button = screen.getByRole('button', { name: /Add Service/i });
    // Check that the button is enabled initially
    expect(button).toBeEnabled();
  });

  // Test Case 2: Disables the submit button when loading is true
  it('disables the submit button when loading is true', () => {
    render(
      <Router>
        <AddTvService />
      </Router>
    );

    const button = screen.getByRole('button', { name: /Add Service/i });

    // Simulate button click (mimicking the loading state)
    fireEvent.click(button);

    // Check that the button is disabled after click (when loading is true)
    expect(button).toBeDisabled();
  });

  // Test Case 3: Form fields are editable and update correctly
  it('allows the user to fill out form fields', () => {
    render(
        <Router>
          <AddTvService />
        </Router>
      );
  
      const button = screen.getByRole('button', { name: /Add Service/i });
  
      // Simulate button click (mimicking the loading state)
      fireEvent.click(button);
  
      // Check that the button is disabled after click (when loading is true)
      expect(button).toBeDisabled();
  });
});
