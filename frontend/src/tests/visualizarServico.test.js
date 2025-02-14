import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import VisualizarServico from "../components/VisualizarServico";

jest.mock("axios");

describe("VisualizarServico Component", () => {
  const mockServico = {
    nome: "Banho Premium",
    duracao: "30",
    preco: "50.00",
    descricao: "Corte profissional com lavagem e finalização."
  };

  test("deve exibir os detalhes do serviço corretamente", async () => {
    axios.get.mockResolvedValue({ data: mockServico });

    render(
      <MemoryRouter initialEntries={["/servicos/1"]}>
        <Routes>
          <Route path="/servicos/:id" element={<VisualizarServico />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockServico.nome)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockServico.duracao)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockServico.preco)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockServico.descricao)).toBeInTheDocument();
    });
  });

  test("deve exibir a mensagem de erro quando a requisição falhar", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar serviço" } } });

    render(
      <MemoryRouter initialEntries={["/servicos/1"]}>
        <Routes>
          <Route path="/servicos/:id" element={<VisualizarServico />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar serviço")).toBeInTheDocument();
    });
  });
});
