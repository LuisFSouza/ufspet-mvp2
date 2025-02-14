import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Estoque from "../components/Estoque";
import axios from "axios";

jest.mock("axios");

describe("Estoque Component", () => {
    test("deve renderizar corretamente", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { cod: 1, nome: "Produto A", marca: "Marca A", preco: "10.50", quantidade: 5, fornecedor: "Fornecedor A" },
                { cod: 2, nome: "Produto B", marca: "Marca B", preco: "20.75", quantidade: 10, fornecedor: "Fornecedor B" }
            ]
        });

        render(
            <MemoryRouter>
                <Estoque />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Produto A")).toBeInTheDocument());
        expect(screen.getByText("Marca A")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("Fornecedor A")).toBeInTheDocument();
    });

    test("deve exibir mensagem de erro ao falhar a requisição", async () => {
        axios.get.mockRejectedValueOnce({ response: { data: { message: "Erro ao carregar estoque" } } });

        render(
            <MemoryRouter>
                <Estoque />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Erro ao carregar estoque")).toBeInTheDocument());
    });

    test("deve exibir mensagem de sucesso vinda da navegação", async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter initialEntries={[{ pathname: "/estoque", state: { tipo: "sucesso", mensagem: "Produto cadastrado com sucesso" } }]}>
                <Estoque />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Produto cadastrado com sucesso")).toBeInTheDocument());
    });
});
