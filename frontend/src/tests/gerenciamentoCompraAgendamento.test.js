import { render, screen } from '@testing-library/react';
import GerenciamentoCompraAgendamento from '../components/GerenciamentoCompraAgendamento';

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

describe('GerenciamentoCompraAgendamento Component', () => {
  const estadosMock = {
    cliente: 'João Silva',
    servico: 'Corte de Cabelo',
    data: '2025-02-15T10:30',
    formaPgto: 'Cartão de Crédito',
    status: 'Confirmado',
    total: '150.00'
  };

  const botoesMock = [<button key="1">Salvar</button>, <button key="2">Cancelar</button>];

  it('deve renderizar corretamente os títulos e os campos de entrada', () => {
    render(<GerenciamentoCompraAgendamento 
      titulo="Gerenciar Compra" 
      subtitulo="Detalhes da Compra" 
      botoes={botoesMock} 
      estados={estadosMock} 
    />);

    // Verificar se os títulos são renderizados corretamente
    expect(screen.getByTestId('titulo')).toHaveTextContent('Gerenciar Compra');
    expect(screen.getByTestId('subtitulo')).toHaveTextContent('Detalhes da Compra');

    // Verificar se os campos estão sendo renderizados corretamente
    expect(screen.getByPlaceholderText('Cliente da compra')).toHaveValue('João Silva');
    expect(screen.getByPlaceholderText('Serviço da compra')).toHaveValue('Corte de Cabelo');
    expect(screen.getByPlaceholderText('Data da compra')).toHaveValue('2025-02-15T10:30');
    expect(screen.getByPlaceholderText('Forma de pagamento')).toHaveValue('Cartão de Crédito');
    expect(screen.getByPlaceholderText('Status do agendamento')).toHaveValue('Confirmado');
    expect(screen.getByPlaceholderText('Total da compra')).toHaveValue('150.00');

    // Verificar se os botões estão presentes
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
});
