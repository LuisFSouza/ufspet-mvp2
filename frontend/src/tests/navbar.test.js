// Não funciona o react-router-dom 
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavBar from "../components/NavBar";

describe("NavBar Component", () => {
  test("Renderiza todos os links corretamente", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Verificando se todos os links existem no documento
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Vendas")).toBeInTheDocument();
    expect(screen.getByText("Agendamentos")).toBeInTheDocument();
    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Clientes")).toBeInTheDocument();
    expect(screen.getByText("Estoque")).toBeInTheDocument();
  });

  test("Destaca corretamente a aba ativa", () => {
    render(
      <MemoryRouter initialEntries={["/vendas"]}>
        <NavBar />
      </MemoryRouter>
    );

    // O link com ID "vendas" deve ser o ativo
    const activeItem = screen.getByText("Vendas").closest("a");
    expect(activeItem).toHaveStyle("color: rgb(111, 145, 127)");

  });
});
