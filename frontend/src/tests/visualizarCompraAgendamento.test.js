import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import VisualizarCompraAgendamento from "../components/VisualizarCompraAgendamento";

jest.mock("axios");

describe("VisualizarCompraAgendamento Component", () => {
  const mockAgendamento = {
    cliente_id: 1,
    cliente: { nome: "Maria Souza" },
    servico_id: 2,
    servico: { nome: "Banho", preco: 50.0 },
    data: "2024-02-12T15:30:00Z",
    formaPgto: "PIX",
    status: "Pago",
  };

  test("deve exibir os detalhes da compra/agendamento corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockAgendamento });

    render(
      <MemoryRouter initialEntries={["/clientes/1/compras/2"]}>
        <Routes>
          <Route path="/clientes/:idcliente/compras/:id" element={<VisualizarCompraAgendamento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockAgendamento.cliente_id} - ${mockAgendamento.cliente.nome}`)).toBeInTheDocument();
      expect(screen.getByDisplayValue(`${mockAgendamento.servico_id} - ${mockAgendamento.servico.nome}`)).toBeInTheDocument();
      expect(screen.getByDisplayValue(dayjs(mockAgendamento.data).format("YYYY-MM-DDTHH:mm"))).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockAgendamento.formaPgto)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockAgendamento.status)).toBeInTheDocument();
      expect(screen.getByDisplayValue("50,00")).toBeInTheDocument();
    });
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar compra/agendamento" } } });

    render(
      <MemoryRouter initialEntries={["/clientes/1/compras/2"]}>
        <Routes>
          <Route path="/clientes/:idcliente/compras/:id" element={<VisualizarCompraAgendamento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar compra/agendamento")).toBeInTheDocument();
    });
  });
});
