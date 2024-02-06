export interface FinancialNode {
    id: string;
    name: string;
    description: string;
    currencyId: number;
    amount: number;
    userId: string;
    isExternal: boolean;
}

export const nodes = [
    {
        id: "1",
        name: "myName",
        description: "Some description",
        currencyId: 1,
        amount: 12,
        userId: "userId",
        isExternal: false
    },
    {
        id: "2",
        name: "myAnotherName",
        description: "Some description",
        currencyId: 1,
        amount: 12,
        userId: "userId",
        isExternal: false
    }
]