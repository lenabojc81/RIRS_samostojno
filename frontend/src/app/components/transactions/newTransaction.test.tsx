import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import NewTransaction from "./newTransaction";

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

global.fetch = jest.fn();
global.alert = jest.fn();

describe("NewTransaction Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders all input fields", () => {
        render(<NewTransaction />);
        expect(screen.getByText(/New Transaction/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name of Transaction/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    });

    test("renders buttons correctly", () => {
        render(<NewTransaction />);
        expect(screen.getByText(/Income/i)).toBeInTheDocument();
        expect(screen.getByText(/Expense/i)).toBeInTheDocument();
        expect(screen.getByText(/Save Transaction/i)).toBeInTheDocument();
        expect(screen.getByText(/Income/i)).toHaveClass("btn-primary");
        expect(screen.getByText(/Expense/i)).toHaveClass("btn-outline-primary");
        expect(screen.getByText(/Save Transaction/i)).toHaveClass("btn-success");
    });

    test("shows validation error if inputs are invalid", async () => {
        render(<NewTransaction />);

        const saveButton = screen.getByText(/Save Transaction/i);

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(global.alert).toHaveBeenCalledWith(
            "Validation Error: Please enter the name of the transaction."
        );
    });

    test("shows validation error for invalid amount", async () => {
        render(<NewTransaction />);

        const nameInput = screen.getByLabelText(/Name of Transaction/i);
        const saveButton = screen.getByText(/Save Transaction/i);

        fireEvent.change(nameInput, { target: { value: "Test Transaction" } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(global.alert).toHaveBeenCalledWith(
            "Validation Error: Please enter a valid amount greater than 0."
        );
    });

    test("toggles transaction type correctly", () => {
        render(<NewTransaction />);

        const incomeButton = screen.getByText(/Income/i);
        const expenseButton = screen.getByText(/Expense/i);

        expect(incomeButton).toHaveClass("btn-primary");
        expect(expenseButton).toHaveClass("btn-outline-primary");

        fireEvent.click(expenseButton);

        expect(expenseButton).toHaveClass("btn-primary");
        expect(incomeButton).toHaveClass("btn-outline-primary");

        fireEvent.click(incomeButton);

        expect(incomeButton).toHaveClass("btn-primary");
        expect(expenseButton).toHaveClass("btn-outline-primary");
    });
});
