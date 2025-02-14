import { render, screen } from "@testing-library/react";
import Cabecalho from "../components/Cabecalho"; // Ajuste o caminho conforme necessário
import "@testing-library/jest-dom";

describe("Cabecalho Component", () => {
  test("Renderiza corretamente com título e subtítulo", () => {
    render(<Cabecalho titulo="Meu Título" subtitulo="Meu Subtítulo" classN="test-class" />);
    expect(screen.getByText("Meu Título")).toBeInTheDocument();
    expect(screen.getByText("Meu Subtítulo")).toBeInTheDocument();
  });

  test("Aplica corretamente a classe CSS", () => {
    const { container } = render(<Cabecalho titulo="Teste" subtitulo="Subteste" classN="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
