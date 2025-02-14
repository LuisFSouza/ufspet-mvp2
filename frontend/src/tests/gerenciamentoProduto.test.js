import { render, screen, fireEvent } from "@testing-library/react";
import GerenciamentoProduto from "../components/GerenciamentoProduto";

// Mock do componente TextField para testar apenas o GerenciamentoProduto
jest.mock("../components/TextField", () => ({ 
  __esModule: true, 
  default: ({ titulo, value, setValue, placeholder }) => (
    <input 
      aria-label={titulo} 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
      placeholder={placeholder} 
    />
  ) 
}));

describe("GerenciamentoProduto", () => {
  const mockSetEstados = {
    setNome: jest.fn(),
    setMarca: jest.fn(),
    setPreco: jest.fn(),
    setQuantidade: jest.fn(),
    setFornecedor: jest.fn(),
  };

  const mockEstados = {
    nome: "",
    marca: "",
    preco: 0,
    quantidade: 0,
    fornecedor: "",
  };

  test("deve renderizar os campos corretamente", () => {
    render(
      <GerenciamentoProduto 
        titulo="Gerenciamento de Produto" 
        subtitulo="Adicione ou edite os produtos" 
        botoes={[]} 
        estados={mockEstados} 
        setEstados={mockSetEstados} 
        visualizacao={true} 
      />
    );

    // Verificar se os campos de texto estão sendo renderizados corretamente
    expect(screen.getByPlaceholderText("Digite o nome do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite a marca do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o preço do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite a quantidade do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o fornecedor do produto")).toBeInTheDocument();
  });

  test("deve chamar setValue quando um campo é alterado", () => {
    render(
      <GerenciamentoProduto 
        titulo="Gerenciamento de Produto" 
        subtitulo="Adicione ou edite os produtos" 
        botoes={[]} 
        estados={mockEstados} 
        setEstados={mockSetEstados} 
        visualizacao={true} 
      />
    );

    // Simular mudança no campo "Nome do Produto"
    fireEvent.change(screen.getByPlaceholderText("Digite o nome do produto"), {
      target: { value: "Produto Teste" }
    });

    // Verificar se a função setNome foi chamada
    expect(mockSetEstados.setNome).toHaveBeenCalledWith("Produto Teste");
  });

  test("deve exibir o título corretamente", () => {
    render(
      <GerenciamentoProduto 
        titulo="Gerenciamento de Produto" 
        subtitulo="Adicione ou edite os produtos" 
        botoes={[]} 
        estados={mockEstados} 
        setEstados={mockSetEstados} 
        visualizacao={true} 
      />
    );

    // Verificar se o título está sendo renderizado corretamente
    expect(screen.getByText("Gerenciamento de Produto")).toBeInTheDocument();
  });
});
