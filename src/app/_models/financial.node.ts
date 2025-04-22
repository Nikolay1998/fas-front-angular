export interface FinancialNode {
    id: string;
    name: string;
    description: string;
    currencyId: number;
    currencySymbol: string;
    amount: number;
    userId: string;
    external: boolean;
    lastTransactionDate: Date;
    overdraft: boolean;
    archived: boolean;
}
