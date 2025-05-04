import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SimpleIcon from '../SimpleIcon';

describe('SimpleIcon', () => {
  it('renders search icon correctly', () => {
    render(<SimpleIcon name="search" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders heart icon correctly', () => {
    render(<SimpleIcon name="heart" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders globe icon correctly', () => {
    render(<SimpleIcon name="globe" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies custom className', () => {
    render(<SimpleIcon name="search" className="custom-class" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveClass('custom-class');
  });

  it('returns null for unknown icon name', () => {
    const { container } = render(<SimpleIcon name="unknown" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with default props', () => {
    render(<SimpleIcon name="search" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders with custom size', () => {
    render(<SimpleIcon name="search" className="w-6 h-6" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveClass('w-6', 'h-6');
  });

  it('renders with custom color', () => {
    render(<SimpleIcon name="search" className="text-blue-500" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveClass('text-blue-500');
  });
}); 