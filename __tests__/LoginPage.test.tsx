import { render, screen } from '@testing-library/react';
import LoginPage from '../app/login/page';

describe('Login page', () => {
  it('renders sign up button', () => {
    render(<LoginPage />);
    expect(screen.getByText(/sign up with github/i)).toBeInTheDocument();
  });
});
