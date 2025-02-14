import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import VisualizarCliente from "../components/VisualizarCliente";

jest.mock("axios");

describe("VisualizarCliente Component", () => {
  const mockCliente = {
    nome: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    telefone: "(11)98765-4321",
    endereco: "Rua Exemplo, 123 - São Paulo/SP",
  };

  test("deve exibir os detalhes do cliente corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockCliente });

    render(
      <MemoryRouter initialEntries={["/clientes/1"]}>
        <Routes>
          <Route path="/clientes/:id" element={<VisualizarCliente />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockCliente.nome)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCliente.cpf)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCliente.email)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCliente.telefone)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCliente.endereco)).toBeInTheDocument();
    });
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar cliente" } } });

    render(
      <MemoryRouter initialEntries={["/clientes/1"]}>
        <Routes>
          <Route path="/clientes/:id" element={<VisualizarCliente />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar cliente")).toBeInTheDocument();
    });
  });
});
