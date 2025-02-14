import { render, screen, waitFor } from "@testing-library/react";
import Relatorio from "../components/Relatorio";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MemoryRouter } from "react-router";

jest.mock("axios");
jest.mock("html2canvas");
jest.mock("jspdf");

describe("Relatorio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test("renderiza título do relatório", async () => {
    axios.get.mockResolvedValue({
      data: [
        { receita: 10000, quantidade: 50, vendasInfo: [{ salesTotal: 500 }] },
      ],
    });

    renderWithRouter(<Relatorio />);

    await waitFor(() =>
      expect(screen.getByText("Relatório de Vendas")).toBeInTheDocument()
    );
  });

});
