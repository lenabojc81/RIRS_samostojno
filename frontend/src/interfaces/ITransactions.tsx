export interface ITransaction {
    _id?: string;
    name: string;
    amount: number;
    expense: boolean;
    date: Date;
    category: string;
}

export const initialTransaction: ITransaction = {
    name: "",
    amount: 0,
    expense: false,
    date: new Date(),
    category: "",
};