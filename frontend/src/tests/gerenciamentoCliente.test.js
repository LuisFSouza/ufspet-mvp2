import { render, screen } from '@testing-library/react';
import GerenciamentoCliente from '../components/GerenciamentoCliente';
import { format } from "@react-input/mask";

// Mock do componente Acao
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

describe('GerenciamentoCliente Component', () => {
  const estadosMock = {
    nome: 'João Silva',
    cpf: '12345678900',
    email: 'joao@email.com',
    telefone: '11987654321',
    endereco: 'Rua das Flores, 123'
  };

  const setEstadosMock = {
    setNome: jest.fn(),
    setCpf: jest.fn(),
    setEmail: jest.fn(),
    setTelefone: jest.fn(),
    setEndereco: jest.fn(),
  };

  const botoesMock = [<button key="1">Salvar</button>, <button key="2">Cancelar</button>];

  it('deve renderizar corretamente os títulos e os campos de entrada', () => {
    render(<GerenciamentoCliente 
      titulo="Gerenciar Cliente" 
      subtitulo="Cadastro de Cliente" 
      botoes={botoesMock} 
      estados={estadosMock} 
      setEstados={setEstadosMock} 
      visualizacao={false} 
    />);

    // Verificar se os títulos são renderizados corretamente
    expect(screen.getByTestId('titulo')).toHaveTextContent('Gerenciar Cliente');
    expect(screen.getByTestId('subtitulo')).toHaveTextContent('Cadastro de Cliente');

    // Verificar se os campos estão sendo renderizados corretamente
    expect(screen.getByPlaceholderText('Digite o nome do cliente')).toHaveValue('João Silva');
    expect(screen.getByPlaceholderText('Digite a CPF do cliente')).toHaveValue(format(estadosMock.cpf, {mask: "___.___.___-__", replacement: { _: /\d/ }}));
    expect(screen.getByPlaceholderText('Digite o e-mail do cliente')).toHaveValue('joao@email.com');
    expect(screen.getByPlaceholderText('Digite o telefone do cliente')).toHaveValue(format(estadosMock.telefone, {mask: "(__)_____-____", replacement: { _: /\d/ }}));
    expect(screen.getByPlaceholderText('Digite o endereço do cliente')).toHaveValue('Rua das Flores, 123');

    // Verificar se os botões estão presentes
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
});
