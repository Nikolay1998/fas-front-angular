export interface Transaction {
    id: string,
    description: string,
    senderNodeId: string,
    receiverNodeId: string,
    senderNodeName: string,
    receiverNodeName: string,
    senderAmount: number,
    receiverAmount: number,
    senderCurrencyId: number,
    receiverCurrencyId: number,
    senderCurrencySymbol: string,
    receiverCurrencySymbol: string,
    dateTime: Date,
    isCancelled: boolean,
    userId: string
}