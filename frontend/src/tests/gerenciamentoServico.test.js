import { render, screen } from '@testing-library/react';
import GerenciamentoServico from '../components/GerenciamentoServico';

// Mock do componente Acao para garantir que ele renderiza os filhos corretamente
jest.mock('../components/Acao', () => ({ titulo, subtitulo, campos, botoes }) => (
  <div>
    <h1 data-testid="titulo">{titulo}</h1>
    <h2 data-testid="subtitulo">{subtitulo}</h2>
    <div data-testid="campos">{campos.map((campo, index) => <div key={index}>{campo.component}</div>)}</div>
    <div data-testid="botoes">{botoes}</div>
  </div>
));

// Mock do TextField para simular um input
jest.mock('../components/TextField', () => ({ placeholder, value }) => (
  <input placeholder={placeholder} value={value} readOnly />
));

describe('GerenciamentoServico Component', () => {
  const estadosMock = {
    nome: 'Corte de cabelo',
    duracao: '30',
    preco: '50.00',
    descricao: 'Corte de cabelo profissional'
  };

  const setEstadosMock = {
    setNome: jest.fn(),
    setDuracao: jest.fn(),
    setPreco: jest.fn(),
    setDescricao: jest.fn(),
  };

  const botoesMock = [<button key="1">Salvar</button>, <button key="2">Cancelar</button>];

  it('deve renderizar corretamente os títulos e os campos de entrada', () => {
    render(<GerenciamentoServico 
      titulo="Gerenciar Serviço" 
      subtitulo="Cadastro de Serviço" 
      botoes={botoesMock} 
      estados={estadosMock} 
      setEstados={setEstadosMock} 
      visualizacao={false} 
    />);

    // Verificar se os títulos são renderizados corretamente
    expect(screen.getByTestId('titulo')).toHaveTextContent('Gerenciar Serviço');
    expect(screen.getByTestId('subtitulo')).toHaveTextContent('Cadastro de Serviço');

    // Verificar se os campos estão sendo renderizados corretamente
    expect(screen.getByPlaceholderText('Digite o nome do serviço')).toHaveValue('Corte de cabelo');
    expect(screen.getByPlaceholderText('Digite a duração do serviço')).toHaveValue('30');
    expect(screen.getByPlaceholderText('Digite o preço do serviço')).toHaveValue('50.00');
    expect(screen.getByPlaceholderText('Digite a descrição do serviço')).toHaveValue('Corte de cabelo profissional');

    // Verificar se os botões estão presentes
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
});
