import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Clientes from "../components/Clientes";
import axios from "axios";

jest.mock("axios");

describe("Clientes Component", () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.delete.mockClear();
    });

    test("deve renderizar corretamente a lista de clientes", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { cod: 1, nome: "Cliente A", cpf: "123.456.789-00", email: "clientea@email.com", telefone: "9999-9999", endereco: "Rua A" },
                { cod: 2, nome: "Cliente B", cpf: "987.654.321-00", email: "clienteb@email.com", telefone: "8888-8888", endereco: "Rua B" }
            ]
        });

        render(
            <MemoryRouter>
                <Clientes />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Cliente A")).toBeInTheDocument());
        expect(screen.getByText("Cliente B")).toBeInTheDocument();
    });

    test("deve exibir mensagem de erro ao falhar a requisição", async () => {
        axios.get.mockRejectedValueOnce({ response: { data: { message: "Erro ao carregar clientes" } } });

        render(
            <MemoryRouter>
                <Clientes />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Erro ao carregar clientes")).toBeInTheDocument());
    });

    test("deve exibir mensagem de sucesso vinda da navegação", async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter initialEntries={[{ pathname: "/clientes", state: { tipo: "sucesso", mensagem: "Cliente cadastrado com sucesso" } }]}>
                <Clientes />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Cliente cadastrado com sucesso")).toBeInTheDocument());
    });

});
