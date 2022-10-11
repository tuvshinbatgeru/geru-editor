import { Network, Alchemy } from "alchemy-sdk";

// TODO: securely read it from env
const settings = {
    apiKey: "ty4BTuS6mhlrzEhWOtW8d3a3MTUc5Lev",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export async function fetchNFTs(wallet, file_types = ['jpeg', 'png', 'jpg']) {
    const nfts = (await alchemy.nft.getNftsForOwner(wallet)).ownedNfts;
    const filteredNfts = nfts && nfts.filter(nft =>
        nft.media && nft.media.length > 0 && nft.media[0].format && file_types.some(type => nft.media[0].format.includes(type))
    );
    return filteredNfts;
};