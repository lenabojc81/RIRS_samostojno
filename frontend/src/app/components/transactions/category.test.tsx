import { render, screen, fireEvent, act } from "@testing-library/react";
import NewTransaction from "./newTransaction";

global.fetch = jest.fn() as jest.Mock;

const mockCategories = [
    { _id: "1", name: "Essential" },
    { _id: "2", name: "Leisure" },
    { _id: "3", name: "Food" },
    { _id: "4", name: "Savings" },
];

describe("NewTransaction Component", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCategories,
        } as Response);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("category buttons initial state", async () => {
        await act(async () => {
            render(<NewTransaction />);
        });
    
        const essentialButton = screen.getByText(/Essential/i);
        const leisureButton = screen.getByText(/Leisure/i);
        const foodButton = screen.getByText(/Food/i);
        const savingsButton = screen.getByText(/Savings/i);
    
        expect(essentialButton).toHaveClass("btn-outline-primary");
        expect(leisureButton).toHaveClass("btn-outline-primary");
        expect(foodButton).toHaveClass("btn-outline-primary");
        expect(savingsButton).toHaveClass("btn-outline-primary");
    });

    test("toggles category correctly", async () => {
        await act(async () => {
            render(<NewTransaction />);
        });
    
        const essentialButton = screen.getByText(/Essential/i);
        const leisureButton = screen.getByText(/Leisure/i);
        const foodButton = screen.getByText(/Food/i);
        const savingsButton = screen.getByText(/Savings/i);

        fireEvent.click(essentialButton);
    
        expect(essentialButton).toHaveClass("btn-primary");
        expect(leisureButton).toHaveClass("btn-outline-primary");
        expect(foodButton).toHaveClass("btn-outline-primary");
        expect(savingsButton).toHaveClass("btn-outline-primary");
    
        fireEvent.click(leisureButton);
    
        expect(leisureButton).toHaveClass("btn-primary");
        expect(essentialButton).toHaveClass("btn-outline-primary");
        expect(foodButton).toHaveClass("btn-outline-primary");
        expect(savingsButton).toHaveClass("btn-outline-primary");
    });
    
});
