import { render, screen, fireEvent } from "@testing-library/react";
import AvisoEstoqueBaixo from "../components/AvisoEstoqueBaixo"; 
import "@testing-library/jest-dom";

describe("AvisoEstoqueBaixo Component", () => {
  test("Renderiza corretamente com produto e quantidade", () => {
    render(<AvisoEstoqueBaixo produto="Produto Teste" quantidade={5} />);
    expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    expect(screen.getByText("5 unidades em estoque")).toBeInTheDocument();
    expect(screen.getByText("Atenção:"));
  });

  test("Fecha o alerta quando o botão de fechar é clicado", () => {
    render(<AvisoEstoqueBaixo produto="Produto Teste" quantidade={5} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText("Produto Teste")).not.toBeInTheDocument();
  });

  test("Nega a aplicação estilos personalizados", () => {
    const customStyle = { backgroundColor: "red" };
    const { container } = render(<AvisoEstoqueBaixo produto="Produto Teste" quantidade={5} style={customStyle} />);
    expect(container.firstChild).not.toHaveStyle("background-color: red");
  });
});
