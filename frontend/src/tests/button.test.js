import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/Button";

describe("Button Component", () => {
  test("renderiza o botão com o texto correto", () => {
    render(<Button texto="Clique Aqui" />);
    expect(screen.getByText("Clique Aqui")).toBeInTheDocument();
  });

  test("aplica as cores corretamente", () => {
    render(<Button cor="red" corTexto="white" texto="Botão" />);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle("background-color: red");
    expect(screen.getByText("Botão")).toHaveStyle("color: white");
  });

  test("chama a função de clique corretamente", () => {
    const handleClick = jest.fn();
    render(<Button texto="Clique" handleClick={handleClick} />);
    
    fireEvent.click(screen.getByText("Clique"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renderiza o ícone corretamente", () => {
    const IconMock = <span data-testid="icon">🔥</span>;
    render(<Button icone={IconMock} texto="Com Ícone" />);
    
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  test("usa a largura e direção correta", () => {
    render(<Button largura="200px" direcao="row" texto="Botão" />);
    const button = screen.getByRole("button");
    
    expect(button).toHaveStyle("width: 200px");
    expect(screen.getByText("Botão").parentElement).toHaveClass("d-flex flex-row");
  });
});
