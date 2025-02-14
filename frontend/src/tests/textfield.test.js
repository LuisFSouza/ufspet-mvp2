import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "../components/TextField";
import "@testing-library/jest-dom";


describe("TextField Component", () => {
  test("Renderiza corretamente um input padrão", () => {
    render(<TextField id="teste" titulo="Nome" tipo="text" placeholder="Digite seu nome" />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });

  test("Renderiza corretamente um campo select", () => {
    const options = [{ cod: "1", nome: "Opção 1" }, { cod: "2", nome: "Opção 2" }];
    render(<TextField id="select" titulo="Escolha" tipo="select" placeholder="Selecione" dadosSelect={options} />);
    expect(screen.getByLabelText("Escolha")).toBeInTheDocument();
  });

  test("Altera o valor corretamente quando digitado", () => {
    const mockSetValue = jest.fn();
    render(<TextField id="input" titulo="Nome" tipo="text" setValue={mockSetValue} />);
    const input = screen.getByLabelText("Nome");
    fireEvent.change(input, { target: { value: "Novo Valor" } });
    expect(mockSetValue).toHaveBeenCalledWith("Novo Valor");
  });

  test("Desabilita campo corretamente quando visualizacao=true", () => {
    render(<TextField id="input" titulo="Nome" tipo="text" visualizacao={true} />);
    expect(screen.getByLabelText("Nome")).toHaveAttribute("readonly");
  });

  test("Renderiza corretamente um campo textarea", () => {
    render(<TextField id="textarea" titulo="Descrição" tipo="textarea" placeholder="Digite uma descrição" />);
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
  });
});
