import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditarVenda from "../components/EditarVenda";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router";

// Mock do Axios para evitar chamadas reais à API
jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }), // Simula um ID de venda
}));

describe("EditarVenda Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it("deve exibir uma mensagem de erro se a API falhar", async () => {
        axios.get.mockRejectedValue({ response: { data: { message: "Erro ao carregar venda" } } });

        render(
            <MemoryRouter>
                <EditarVenda />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Erro ao carregar venda")).toBeInTheDocument();
        });
    });

    it("deve limpar os campos ao clicar em 'Limpar'", async () => {
        axios.get.mockResolvedValue({
            data: {
                cliente: { cod: 10 },
                data: "2024-02-01T10:00:00Z",
                formaPgto: "PIX",
                itens: [{ produto: { cod: 5 }, quantidade: 2 }]
            }
        });

        render(
            <MemoryRouter>
                <EditarVenda />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Limpar"));

        fireEvent.click(screen.getByText("Limpar"));

        await waitFor(() => {
            expect(screen.getByLabelText(/Cliente/i)).toHaveValue("");
            expect(screen.getByLabelText(/Data/i)).toHaveValue("");
            expect(screen.getByLabelText(/Forma de pagamento/i)).toHaveValue("");
        });
    });
});
