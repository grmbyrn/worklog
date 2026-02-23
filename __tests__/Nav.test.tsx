import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Nav from '../app/components/Nav';

describe('Nav component', () => {
  it('renders navigation links', () => {
    render(
      <SessionProvider session={null}>
        <Nav />
      </SessionProvider>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
