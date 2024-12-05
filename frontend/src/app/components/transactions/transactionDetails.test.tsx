import { render, screen, fireEvent, act } from "@testing-library/react";
import TransactionDetails from "./transactionDetails";

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

global.fetch = jest.fn();
global.alert = jest.fn();

const mockTransaction = {
    _id: "12345",
    name: "Test Transaction",
    amount: 50.0,
    expense: true,
    date: new Date(),
};

describe("TransactionDetails Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renders the transaction details correctly
    test("renders transaction details", () => {
        render(<TransactionDetails transaction={mockTransaction} />);

        expect(screen.getByText(/Test Transaction/i)).toBeInTheDocument();
        expect(screen.getByText(/€50.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Expense/i)).toBeInTheDocument();
    });

    // Test 2: Edit button toggles the edit form
    test("shows the edit form when edit button is clicked", async () => {
        render(<TransactionDetails transaction={mockTransaction} />);

        const editButton = screen.getByLabelText("Edit Transaction");
        fireEvent.click(editButton);

        expect(screen.getByDisplayValue(/Test Transaction/i)).toBeInTheDocument(); // Name input
        expect(screen.getByDisplayValue("50")).toBeInTheDocument(); // Amount input
        expect(screen.getByDisplayValue(/expense/i)).toBeInTheDocument(); // Type select
    });

    // Test 3: Save button calls fetch and reloads the page
    test("saves the edited transaction", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        render(<TransactionDetails transaction={mockTransaction} />);

        const editButton = screen.getByLabelText("Edit Transaction");
        fireEvent.click(editButton);

        const nameInput = screen.getByDisplayValue(/Test Transaction/i);
        const saveButton = screen.getByText("OK");

        fireEvent.change(nameInput, { target: { value: "Updated Transaction" } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/transaction/editTransaction/12345"),
            expect.objectContaining({
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...mockTransaction,
                    name: "Updated Transaction",
                }),
            })
        );
    });

    // Test 4: Delete button calls fetch and reloads the page
    test("deletes the transaction", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        render(<TransactionDetails transaction={mockTransaction} />);

        const deleteButton = screen.getByLabelText("Delete Transaction");

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/transaction/deleteTransaction/12345"),
            expect.objectContaining({ method: "Delete" })
        );
    });

    // Test 5: Shows an alert on failed delete
    test("shows an alert if delete fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

        render(<TransactionDetails transaction={mockTransaction} />);

        const deleteButton = screen.getByLabelText("Delete Transaction");

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        expect(global.alert).toHaveBeenCalledWith("Error: Failed to save transaction.");
    });
});
