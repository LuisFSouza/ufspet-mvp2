import { render, screen, fireEvent } from "@testing-library/react";
import GerenciamentoAgendamento from "../components/GerenciamentoAgendamento";
import { BrowserRouter } from "react-router";

const mockSetEstados = {
    setCliente: jest.fn(),
    setServico: jest.fn(),
    setData: jest.fn(),
    setFormaPgto: jest.fn(),
    setStatus: jest.fn()
};

const mockEstados = {
    cliente: "",
    servico: "",
    data: "",
    formaPgto: "",
    status: ""
};

describe("GerenciamentoAgendamento Component", () => {
    test("Renderiza os campos corretamente", () => {
        render(
            <BrowserRouter>
                <GerenciamentoAgendamento 
                    titulo="Gerenciar Agendamento"
                    subtitulo="Teste de Agendamento"
                    botoes={[]}
                    estados={mockEstados}
                    setEstados={mockSetEstados}
                    visualizacao={false}
                    mode={1}
                />
            </BrowserRouter>
        );
        
        expect(screen.getByText("Cliente do agendamento")).toBeInTheDocument();
        expect(screen.getByText("Serviço do agendamento")).toBeInTheDocument();
        expect(screen.getByText("Data do agendamento")).toBeInTheDocument();
        expect(screen.getByText("Forma de pagamento")).toBeInTheDocument();
        expect(screen.getByText("Status do agendamento")).toBeInTheDocument();
    });

    test("Atualiza os estados ao selecionar valores", () => {
        render(
            <BrowserRouter>
                <GerenciamentoAgendamento 
                    titulo="Gerenciar Agendamento"
                    subtitulo="Teste de Agendamento"
                    botoes={[]}
                    estados={mockEstados}
                    setEstados={mockSetEstados}
                    visualizacao={false}
                    mode={1}
                />
            </BrowserRouter>
        );
        
        const clienteSelect = screen.getByLabelText("Cliente do agendamento");
        fireEvent.change(clienteSelect, { target: { value: "1" } });
        expect(mockSetEstados.setCliente).toHaveBeenCalledWith("");
    });
});
