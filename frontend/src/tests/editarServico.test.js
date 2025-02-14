import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import axios from "axios";
import EditarServico from "../components/EditarServico";

jest.mock("axios");

describe("EditarServico", () => {
    const mockServico = {
        nome: "Serviço Teste",
        duracao: 60,
        preco: 100.50,
        descricao: "Descrição de teste"
    };

    const setup = () => {
        return render(
            <MemoryRouter initialEntries={["/servicos/editar/1"]}>
                <Routes>
                    <Route path="/servicos/editar/:id" element={<EditarServico />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockServico });
        axios.patch.mockResolvedValue({});
    });

    test("renderiza corretamente", async () => {
        setup();
        expect(screen.getByText(/Serviços/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByDisplayValue(mockServico.nome)).toBeInTheDocument());
    });

    test("preenche os campos com os dados da API", async () => {
        setup();
        await waitFor(() => {
            expect(screen.getByDisplayValue(mockServico.nome)).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockServico.duracao.toString())).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockServico.preco.toString())).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockServico.descricao)).toBeInTheDocument();
        });
    });

    test("edita o serviço corretamente", async () => {
        setup();
        await waitFor(() => screen.getByDisplayValue(mockServico.nome));

        fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Novo Serviço" } });
        fireEvent.click(screen.getByRole("button", { name: /Editar/i }));


        await waitFor(() =>
            expect(axios.patch).toHaveBeenCalledWith(expect.stringContaining("/servicos/editar/1"), expect.objectContaining({
                nome: "Novo Serviço",
                duracao: 60,
                preco: expect.any(Object),
                descricao: "Descrição de teste"
            }))
        );
    });

    test("limpa os campos ao clicar em 'Limpar'", async () => {
        setup();
        await waitFor(() => screen.getByDisplayValue(mockServico.nome));

        fireEvent.click(screen.getByText(/Limpar/i));

        expect(screen.getByLabelText(/Nome/i).value).toBe("");
        expect(screen.getByLabelText(/Duração/i).value).toBe("");
        expect(screen.getByLabelText(/Preço/i).value).toBe("");
        expect(screen.getByLabelText(/Descrição/i).value).toBe("");
    });
});
