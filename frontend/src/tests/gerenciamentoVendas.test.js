import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GerenciamentoVendas from "../components/GerenciamentoVendas";
import { MemoryRouter } from "react-router";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("GerenciamentoVendas", () => {
  const setEstadosMock = {
    setCliente: jest.fn(),
    setData: jest.fn(),
    setFormaPgto: jest.fn(),
    setItensVenda: jest.fn(),
  };
  const estadosMock = {
    cliente: "",
    data: "",
    formaPgto: "",
    itensVenda: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza os campos corretamente", async () => {
    axios.get.mockResolvedValue({ data: [{ cod: 1, nome: "Cliente 1" }] });

    render(
      <MemoryRouter>
        <GerenciamentoVendas
          titulo="Gerenciar Vendas"
          subtitulo="Gerencie suas vendas"
          botoes={[]}
          estados={estadosMock}
          setEstados={setEstadosMock}
          visualizacao={false}
          mode={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Cliente da venda")).toBeInTheDocument();
    expect(screen.getByText("Data da venda")).toBeInTheDocument();
    expect(screen.getByText("Forma de pagamento")).toBeInTheDocument();
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });

  test("exibe erro ao falhar na busca de clientes", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao buscar clientes" } } });
    
    render(
      <MemoryRouter>
        <GerenciamentoVendas
          titulo="Gerenciar Vendas"
          subtitulo="Gerencie suas vendas"
          botoes={[]}
          estados={estadosMock}
          setEstados={setEstadosMock}
          visualizacao={false}
          mode={1}
        />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/vendas", { state: { tipo: "erro", mensagem: "Erro ao buscar clientes" } }));
  });
});
