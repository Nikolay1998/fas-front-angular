export interface FinancialNode {
    id: string;
    name: string;
    description: string;
    currencyId: number;
    currencySymbol: string;
    amount: number;
    userId: string;
    isExternal: boolean;
    lastTransactionDate: Date,
}