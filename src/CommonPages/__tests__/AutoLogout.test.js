import { render, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import AutoLogout from '../AutoLogout';

jest.useFakeTimers();
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  removeItem: jest.fn(),
};

beforeAll(() => {
  global.localStorage = localStorageMock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AutoLogout Component', () => {
  it('should reset the timer on user activity', () => {
    const setIsUser = jest.fn();
    const setIsAdmin = jest.fn();

    render(<AutoLogout setIsUser={setIsUser} setIsAdmin={setIsAdmin} />);

    // Simulate initial timeout setup
    jest.advanceTimersByTime(500000); // Advance time by less than 10 minutes

    // Simulate user activity
    fireEvent.mouseMove(window);

    // Fast-forward time again
    jest.advanceTimersByTime(500000); // Should not trigger logout yet

    // Expect logout not to have been triggered
    expect(setIsUser).not.toHaveBeenCalled();
    expect(setIsAdmin).not.toHaveBeenCalled();
  });
});
