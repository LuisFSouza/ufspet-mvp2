import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import VisualizarVenda from "../components/VisualizarVenda";
import dayjs from "dayjs";

jest.mock("axios");

describe("VisualizarVenda Component", () => {
  const mockVenda = {
    cliente: { cod: "123", nome: "João Silva" },
    data: "2024-02-12T10:30:00Z",
    formaPgto: "PIX",
    itens: [
      { produto: { cod: "456", nome: "Petisco" }, quantidade: 2 },
      { produto: { cod: "789", nome: "FreeCo" }, quantidade: 1 },
    ],
  };

  test("deve exibir os detalhes da venda corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockVenda });

    render(
      <MemoryRouter initialEntries={["/vendas/1"]}>
        <Routes>
          <Route path="/vendas/:id" element={<VisualizarVenda />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue(`${mockVenda.cliente.cod} - ${mockVenda.cliente.nome}`)).toBeInTheDocument();
        expect(screen.getByDisplayValue(dayjs(mockVenda.data).format("YYYY-MM-DDTHH:mm"))).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockVenda.formaPgto)).toBeInTheDocument();
    
        // Busca todos os inputs com o placeholder "Selecione o produto"
        const produtos = screen.getAllByPlaceholderText("Selecione o produto");
    
        // Verifica se os valores esperados estão presentes
        expect(produtos.some(input => input.value === "456 - Petisco")).toBe(true);
        expect(produtos.some(input => input.value === "789 - FreeCo")).toBe(true);
    });
    
      
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar venda" } } });

    render(
      <MemoryRouter initialEntries={["/vendas/1"]}>
        <Routes>
          <Route path="/vendas/:id" element={<VisualizarVenda />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar venda")).toBeInTheDocument();
    });
  });
});
