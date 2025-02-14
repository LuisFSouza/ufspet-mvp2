import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import VisualizarProduto from "../components/VisualizarProduto";

jest.mock("axios");

describe("VisualizarProduto Component", () => {
  const mockProduto = {
    nome: "PetWell",
    marca: "Dell",
    preco: "4500.00",
    quantidade: "10",
    fornecedor: "TechSupplier"
  };

  test("deve exibir os detalhes do produto corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockProduto });

    render(
      <MemoryRouter initialEntries={["/produtos/1"]}>
        <Routes>
          <Route path="/produtos/:id" element={<VisualizarProduto />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProduto.nome)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProduto.marca)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProduto.preco)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProduto.quantidade)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProduto.fornecedor)).toBeInTheDocument();
    });
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar produto" } } });

    render(
      <MemoryRouter initialEntries={["/produtos/1"]}>
        <Routes>
          <Route path="/produtos/:id" element={<VisualizarProduto />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar produto")).toBeInTheDocument();
    });
  });
});
