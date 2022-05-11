import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test('renders learn react link', () => {
  render(<App />);
  const LikeButtonElement = screen.getByText(/999/i);
  expect(LikeButtonElement).toBeInTheDocument();
  userEvent.click(LikeButtonElement);
  expect(LikeButtonElement.textContent).toBe('♥ 1000');
});
