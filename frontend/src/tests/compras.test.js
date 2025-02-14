import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Compras from "../components/Compras"; 
import axios from "axios";


jest.mock("axios");

describe("Compras Component", () => {
  const idCliente = "123";

  beforeEach(() => {
    axios.get.mockClear();
    axios.get.mockResolvedValue({
      data: [
        { cod: 1, cod_op: "OP001", formaPgto: "PIX", total: 100, data: "2025-02-10T12:00:00Z", tipo: "Venda" },
        { cod: 2, cod_op: "OP002", formaPgto: "CREDITO", total: 200, data: "2025-02-11T12:00:00Z", tipo: "Agendamento" }
      ]
    });
  });

  test("deve exibir a lista de compras", async () => {
    render(
      <MemoryRouter initialEntries={[`/clientes/${idCliente}/compras`]}>
        <Compras />
      </MemoryRouter>
    );

    // Verifica se a tabela de compras é renderizada
    await waitFor(() => expect(screen.getByText("PIX")).toBeInTheDocument());
    expect(screen.getByText("CREDITO")).toBeInTheDocument();
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
  });

  test("deve exibir mensagem de erro ao falhar a requisição", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { message: "Erro ao carregar compras" } } });

    render(
      <MemoryRouter initialEntries={[`/clientes/${idCliente}/compras`]}>
        <Compras />
      </MemoryRouter>
    );

    // Verifica se a mensagem de erro é exibida
    await waitFor(() => expect(screen.getByText("Erro ao carregar compras")).toBeInTheDocument());
  });

  test("deve exibir mensagem de sucesso", async () => {
    render(
      <MemoryRouter initialEntries={[`/clientes/${idCliente}/compras`]}>
        <Compras />
      </MemoryRouter>
    );

    // Supondo que uma mensagem de sucesso esteja sendo exibida após a requisição
    await waitFor(() => expect(screen.queryByText("Compras realizadas")).toBeInTheDocument());
  });

  test("deve selecionar uma compra ao clicar na linha da tabela", async () => {
    render(
      <MemoryRouter initialEntries={[`/clientes/${idCliente}/compras`]}>
        <Compras />
      </MemoryRouter>
    );

    // Verifica se as compras são exibidas
    await waitFor(() => expect(screen.getByText("PIX")).toBeInTheDocument());

    // Simula a seleção de uma compra
    fireEvent.click(screen.getByText("PIX"));

    // Verifica se a linha foi selecionada (código da compra 1)
    expect(screen.getByText("PIX").closest('tr')).toHaveClass('linhaSelecionada'); // Adapte isso conforme o seu CSS de seleção
  });
});
