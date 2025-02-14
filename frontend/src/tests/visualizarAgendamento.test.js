import { render, screen, waitFor } from "@testing-library/react";
import VisualizarAgendamento from "../components/VisualizarAgendamento";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router";
import userEvent from "@testing-library/user-event";

jest.mock("axios"); // Mockando o módulo axios

describe("VisualizarAgendamento Component", () => {
  const mockAgendamento = {
    cliente_id: 1,
    cliente: { nome: "João Silva" },
    servico_id: 2,
    servico: { nome: "Corte de Cabelo" },
    data: "2024-02-15T14:00:00Z",
    formaPgto: "CREDITO",
    status: "Confirmado",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve exibir os detalhes do agendamento corretamente", async () => {
    axios.get.mockResolvedValueOnce({ data: mockAgendamento });

    render(
      <MemoryRouter initialEntries={["/agendamentos/1"]}>
        <Routes>
          <Route path="/agendamentos/:id" element={<VisualizarAgendamento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue("1 - João Silva")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2 - Corte de Cabelo")).toBeInTheDocument();
        expect(screen.getByDisplayValue("CREDITO")).toBeInTheDocument();
      });
      
  });

  test("deve exibir mensagem de erro se a requisição falhar", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { message: "Erro ao buscar agendamento" } },
    });

    render(
      <MemoryRouter initialEntries={["/agendamentos/1"]}>
        <Routes>
          <Route path="/agendamentos/:id" element={<VisualizarAgendamento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao buscar agendamento")).toBeInTheDocument();
    });
  });

  test("deve exibir mensagem genérica se não conseguir conectar ao servidor", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/agendamentos/1"]}>
        <Routes>
          <Route path="/agendamentos/:id" element={<VisualizarAgendamento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possivel se conectar com o servidor")
      ).toBeInTheDocument();
    });
  });

});
