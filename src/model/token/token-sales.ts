interface Sender{
    nfts: Token[];
}

interface TokenSale extends BuyTransaction{
    status: string;
    priceWei: string;
    blockchainId: string;
    senderSide: Sender;
}