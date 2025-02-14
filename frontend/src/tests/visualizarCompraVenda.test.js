import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import VisualizarCompraVenda from "../components/VisualizarCompraVenda";

jest.mock("axios");

describe("VisualizarCompraVenda Component", () => {
  const mockVenda = {
    cliente: { cod: 1, nome: "João Silva" },
    data: "2024-02-12T15:30:00Z",
    formaPgto: "PIX",
    itens: [
      { produto: { cod: 101, nome: "Shampoo Pet" }, quantidade: 2 },
      { produto: { cod: 102, nome: "Condicionador Au Au" }, quantidade: 1 },
    ],
    totalVenda: 75.5,
  };

  test("deve exibir os detalhes da venda corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockVenda });

    render(
      <MemoryRouter initialEntries={["/clientes/1/compras/2"]}>
        <Routes>
          <Route path="/clientes/:idcliente/compras/:id" element={<VisualizarCompraVenda />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockVenda.cliente.cod} - ${mockVenda.cliente.nome}`)).toBeInTheDocument();
      expect(screen.getByDisplayValue(dayjs(mockVenda.data).format("YYYY-MM-DDTHH:mm"))).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockVenda.formaPgto)).toBeInTheDocument();
      expect(screen.getByDisplayValue("75,50")).toBeInTheDocument();
      
      expect(screen.getByDisplayValue("101 - Shampoo Pet")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("102 - Condicionador Au Au")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar venda" } } });

    render(
      <MemoryRouter initialEntries={["/clientes/1/compras/2"]}>
        <Routes>
          <Route path="/clientes/:idcliente/compras/:id" element={<VisualizarCompraVenda />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar venda")).toBeInTheDocument();
    });
  });
});
