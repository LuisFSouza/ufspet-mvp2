import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditarCliente from "../components/EditarCliente";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" })
}));

describe("EditarCliente Component", () => {

    test("Edita um cliente e navega para a tela de clientes", async () => {
        axios.get.mockResolvedValueOnce({ data: { nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", endereco: "Rua A, 123" } });
        axios.patch.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={["/clientes/editar/1"]}>
                <Routes>
                    <Route path="/clientes/editar/:id" element={<EditarCliente />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText("Nome do Cliente"), { target: { value: "Carlos Souza" } });
        fireEvent.click(screen.getByText("Editar"));

        await waitFor(() => expect(axios.patch).toHaveBeenCalledWith(
            expect.stringContaining("/clientes/editar/1"),
            expect.objectContaining({ nome: "Carlos Souza" })
        ));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/clientes", expect.any(Object)));
    });

    test("Exibe erro quando falha a requisição", async () => {
        axios.get.mockRejectedValueOnce({ response: { data: { message: "Erro ao buscar cliente" } } });

        render(
            <MemoryRouter>
                <EditarCliente />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("Erro ao buscar cliente")).toBeInTheDocument());
    });
});
