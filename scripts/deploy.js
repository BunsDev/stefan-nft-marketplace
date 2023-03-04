const hre = require("hardhat");
const {
  storeContractAddress,
  verifyContract,
  printEtherscanLink,
} = require("./helper-functions");

const { ethers, network } = hre;

let DutchAuctionFactoryaddress = "";
let EngAuctionFactoryaddress = "";
let NftAddressV2 = "";
let NFTMarketplaceAddressV2 = "";

// Biconomy GOERLI forwarder address to enable native meta transactions

const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

async function deploy(contractName, args = []) {
  const { chainId } = network.config;

  const CF = await ethers.getContractFactory(contractName);
  const contract = await CF.deploy(...args);

  await contract.deployed();
  await storeContractAddress(contract, contractName);
  await verifyContract(contract, args);

  console.log("Deployer:", (await ethers.getSigners())[0].address);
  console.log(`${contractName} deployed to:`, contract.address);
  switch (contractName) {
    case "DutchAuctionFactory":
      DutchAuctionFactoryaddress = contract.address;
      break;

    case "EngAuctionFactory":
      EngAuctionFactoryaddress = contract.address;
      break;

    case "NftMarketPlaceV2":
      NFTMarketplaceAddressV2 = contract.address;
      break;

    case "NFTV2":
      NftAddressV2 = contract.address;
      break;
    default:
      console.log("Wrong contract");
  }
  NftAddressV2 = printEtherscanLink(contract.address, chainId);
}

async function main() {
  await deploy("DutchAuctionFactory");
  await deploy("EngAuctionFactory");
  await deploy("NftMarketPlaceV2", [
    DutchAuctionFactoryaddress,
    EngAuctionFactoryaddress,
    forwarderAddress,
  ]);
  await deploy("NFTV2", [NFTMarketplaceAddressV2, forwarderAddress]);
  console.log(NftAddressV2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
