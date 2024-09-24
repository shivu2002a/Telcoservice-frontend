import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';

// Mocking the child components to avoid any external influence
jest.mock('../MostAvailedServices', () => () => <div>Most Availed Services</div>);
jest.mock('../RequestsHistory', () => () => <div>Requests History</div>);
jest.mock('../Feedback', () => () => <div>User Feedbacks</div>);

describe('AdminDashboard Component', () => {

  beforeEach(() => {
    render(<AdminDashboard />);
  });

  // Test 1: Most Availed Services section renders correctly
  it('renders the Most Availed Services section', () => {
    expect(screen.getByText('Most Availed Services')).toBeInTheDocument();
  });

  // Test 2: No crash occurs when clicking a navigation link
  it('does not crash when clicking a navigation link', () => {
    const internetLink = screen.getByText('Most Availed Internet Services');
    expect(() => fireEvent.click(internetLink)).not.toThrow(); // Ensure no crash
  });
});
