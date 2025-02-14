import { render, screen } from '@testing-library/react';
import App from './App';

test('Renderiza navbar link "Produtos"', () => {
  render(<App />);
  const produtosLink = screen.getByText(/produtos/i);
  expect(produtosLink).toBeInTheDocument();
});
