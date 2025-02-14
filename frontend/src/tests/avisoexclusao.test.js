import AvisoExclusao from "../components/AvisoExclusao";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";


describe("AvisoExclusao Component", () => {
  test("Renderiza corretamente com a entidade fornecida", () => {
    render(<AvisoExclusao entidade="tarefa" handleSubmit={jest.fn()} handleCancel={jest.fn()} />);
    expect(screen.getByText("Tem certeza de que deseja excluir este tarefa?"))
      .toBeInTheDocument();
  });

  test("Chama a função de submissão ao clicar no botão 'Sim'", () => {
    const mockSubmit = jest.fn();
    render(<AvisoExclusao entidade="item" handleSubmit={mockSubmit} handleCancel={jest.fn()} />);
    const simButton = screen.getByText("Sim");
    fireEvent.click(simButton);
    expect(mockSubmit).toHaveBeenCalled();
  });

  test("Chama a função de cancelamento ao clicar no botão 'Não'", () => {
    const mockCancel = jest.fn();
    render(<AvisoExclusao entidade="usuário" handleSubmit={jest.fn()} handleCancel={mockCancel} />);
    const naoButton = screen.getByText("Não");
    fireEvent.click(naoButton);
    expect(mockCancel).toHaveBeenCalled();
  });
});
