import Table from "../components/Table";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock de dados de teste
const cabecalhos = ['Código', 'Nome', 'Idade'];
const dados = [
  { cod: 1, Nome: 'João', Idade: 30 },
  { cod: 2, Nome: 'Maria', Idade: 25 },
  { cod: 3, Nome: 'Pedro', Idade: 40 },
];

describe('Table Component', () => {
  test('Renderiza corretamente a tabela com os cabeçalhos e dados', () => {
    render(<Table cabecalhos={cabecalhos} dados={dados} linetrade={jest.fn()} lineSelected={null} />);

    // Verificando se os cabeçalhos da tabela estão sendo renderizados corretamente
    cabecalhos.forEach(cabecalho => {
      expect(screen.getByText(cabecalho)).toBeInTheDocument();
    });
    dados.forEach(dado => {
      expect(screen.getByText(dado.Nome)).toBeInTheDocument();
      expect(screen.getByText(dado.Idade.toString())).toBeInTheDocument();
    });
  });

  test('Seleciona uma linha ao clicar', () => {
    const linetradeMock = jest.fn();
    render(<Table cabecalhos={cabecalhos} dados={dados} linetrade={linetradeMock} lineSelected={1} />);

    const linhaSelecionada = screen.getByText('João').closest('tr');
    expect(linhaSelecionada).toHaveClass('linhaSelecionada');

    fireEvent.click(linhaSelecionada);
    expect(linetradeMock).toHaveBeenCalledWith(1);
  });

  test('Não seleciona uma linha quando não existe linha selecionada', () => {
    const linetradeMock = jest.fn();
    render(<Table cabecalhos={cabecalhos} dados={dados} linetrade={linetradeMock} lineSelected={null} />);

    dados.forEach(dado => {
      const linha = screen.getByText(dado.Nome).closest('tr');
      expect(linha).not.toHaveClass('linhaSelecionada');
    });
  });
});