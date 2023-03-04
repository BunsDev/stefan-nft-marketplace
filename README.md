# NFT-Marketplace

## What upgraded from V1 -> V2 ?

There were some fixes to the nftMarketplace as well as NFT contract not keeping correct state about NFTs if maliciously used.

## Approach

Running currently on Fantoms testnet
A NFT Marketplace running currently on Fantoms testnet. Let's you mint, sell and buy NFT's. During the minting we store the Metadata on IPFS and only store the TokenURI on-chain.

## Status

The NFT Marketplace is currently running and fully functional on Fantoms testnet at

1. NFT Market:

2. NFT:

The Website is online and running at [Website]()

## Local environment set up

1. git clone

2. npm i

3. set up .env

4. npm start

5. npx hardhat run scripts/deploy.js --network fantomTestnet

6. npx hardhat console --network fantomTestnet

7. const contract = await ethers.getContractFactory("NftMarketPlaceV2")

8. const Contract = await contract.attach("[input address from deploying NftMarketPlaceV2 contract (step 6)]")

9. await Contract.setNftAddress("[input address from NFTV2 contract (step 6)]")

## Stack

### Blockchain Technologies

1. Environment - [Hardhat](https://hardhat.org/)
2. File Storage - [IPFS](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#install)
3. Client - [ethers.js](https://docs.ethers.io/v5/)
4. Blockchain - [Fantom](https://docs.fantom.foundation/quick-start/short-guide)

## Biconomy

### Demo videos:

NFT Marketplace:

SKD Hyphen: https://www.youtube.com/watch?v=cViRhJu1qIM

### Hyphen Widget

The Biconomy Hyphen Widget allows for fast and easy cross chain movement of funds. You can easily with a few clicks and seconds transfer your
Tokens from one network to another

Biconomy docs: https://docs.biconomy.io/products/hyphen-instant-cross-chain-transfers/hyphen-widget

Added at: [Code]()

### Frontend

- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)
- [Bootstrap]

## Backend

- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Challenges

- First time working with Fantom
- Handling Allowance
- IPFS upload
