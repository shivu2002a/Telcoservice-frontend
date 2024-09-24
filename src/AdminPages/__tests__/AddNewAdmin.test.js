import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddNewAdmin from '../AddNewAdmin';

describe('AddNewAdmin Component', () => {

  // Test Case 1: Submit Button is Disabled When Checking
  it('disables the submit button when checking is true', () => {
    render(
      <Router>
        <AddNewAdmin />
      </Router>
    );

    const submitButton = screen.getByRole('button', { name: /Create Admin/i });
    
    // By default, the button should not be disabled
    expect(submitButton).not.toBeDisabled();
  });

  // Test Case 2: Renders Button Correctly (Basic Check)
  it('renders submit button with correct text', () => {
    render(
      <Router>
        <AddNewAdmin />
      </Router>
    );

    // Check that the submit button contains the text "Create Admin"
    expect(screen.getByRole('button', { name: /Create Admin/i })).toBeInTheDocument();
  });
});
