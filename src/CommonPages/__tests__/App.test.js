import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import '@testing-library/jest-dom/extend-expect';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  jest.spyOn(Storage.prototype, 'setItem');
  jest.spyOn(Storage.prototype, 'getItem');
});

test('should save the last visited page to localStorage when navigating', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/services']}>
      <App />
    </MemoryRouter>
  );

  // Check if localStorage was called with the correct path
  expect(localStorage.setItem).toHaveBeenCalledWith('lastVisitedPage', '/services');
});