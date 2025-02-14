import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import EditarProduto from "../components/EditarProduto";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" })
}));

describe("EditarProduto Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        nome: "Produto Teste",
        marca: "Marca Teste",
        preco: "10.50",
        quantidade: "5",
        fornecedor: "Fornecedor Teste"
      }
    });
  });

  test("deve renderizar o formulário corretamente", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditarProduto />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Marca Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10.50")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Fornecedor Teste")).toBeInTheDocument();
    });
  });

  test("deve exibir erro ao falhar na requisição", async () => {
    axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar produto" } } });
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditarProduto />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar produto")).toBeInTheDocument();
    });
  });

});
