import { render, screen } from '@testing-library/react';
import GerenciamentoCompraVenda from '../components/GerenciamentoCompraVenda';

// Mock do componente Acao
jest.mock('../components/Acao', () => ({ titulo, subtitulo, campos, botoes }) => (
  <div>
    <h1 data-testid="titulo">{titulo}</h1>
    <h2 data-testid="subtitulo">{subtitulo}</h2>
    <div data-testid="campos">{campos.map((campo, index) => <div key={index}>{campo.component}</div>)}</div>
    <div data-testid="botoes">{botoes}</div>
  </div>
));

// Mock do TextField
jest.mock('../components/TextField', () => ({ placeholder, value }) => (
  <input placeholder={placeholder} value={value} readOnly />
));

// Mock do ItensVenda
jest.mock('../components/ItensVenda', () => ({ title, mode, values }) => (
  <div>
    <h3>{title}</h3>
    <ul>
      {values.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
));

describe('GerenciamentoCompraVenda Component', () => {
  const estadosMock = {
    cliente: 'Maria Souza',
    data: '2025-02-20T14:00',
    formaPgto: 'Pix',
    itensVenda: ['Produto 1', 'Produto 2', 'Produto 3'],
    totalVenda: '200.00'
  };

  const botoesMock = [<button key="1">Finalizar</button>, <button key="2">Cancelar</button>];

  it('deve renderizar corretamente os títulos e os campos de entrada', () => {
    render(<GerenciamentoCompraVenda 
      titulo="Gerenciar Venda" 
      subtitulo="Detalhes da Venda" 
      botoes={botoesMock} 
      estados={estadosMock} 
    />);

    // Verificar se os títulos são renderizados corretamente
    expect(screen.getByTestId('titulo')).toHaveTextContent('Gerenciar Venda');
    expect(screen.getByTestId('subtitulo')).toHaveTextContent('Detalhes da Venda');

    // Verificar se os campos estão sendo renderizados corretamente
    expect(screen.getByPlaceholderText('Cliente da compra')).toHaveValue('Maria Souza');
    expect(screen.getByPlaceholderText('Data da compra')).toHaveValue('2025-02-20T14:00');
    expect(screen.getByPlaceholderText('Forma de pagamento')).toHaveValue('Pix');
    expect(screen.getByPlaceholderText('Total da compra')).toHaveValue('200.00');

    // Verificar se os itens da compra foram renderizados corretamente
    expect(screen.getByText('Itens da compra')).toBeInTheDocument();
    expect(screen.getByText('Produto 1')).toBeInTheDocument();
    expect(screen.getByText('Produto 2')).toBeInTheDocument();
    expect(screen.getByText('Produto 3')).toBeInTheDocument();

    // Verificar se os botões estão presentes
    expect(screen.getByText('Finalizar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
});
