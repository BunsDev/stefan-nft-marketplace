import "./App.css";
import React, { useState, useEffect } from "react";
// Routing
import { Route, Routes } from "react-router-dom";

// UI components Library
// eslint-disable-next-line
import { Box, ThemeProvider, Button } from "@mui/material";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Web3Modal (metamask... connection)

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
/* import Walletlink from "walletlink"; */
import Authereum from "authereum";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Pages
import Home from "./Components/pages/Home";
import MintedTokens from "./Components/pages/MintedTokens";
import MintForm from "./Components/pages/MintForm";
import OwnNfts from "./Components/pages/OwnNfts";
import BiconomyCrossChain from "./Components/pages/BiconomyChrossChain";
import TransakGateway from "./Components/pages/TransakGateway";
import NftHistory from "./Components/NftHistory";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Additional Components

import Header from "./Components/Header";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Smart contract data

// ABI's
import NFT from "./config/contracts/NFTV2.json";
import NftMarketPlace from "./config/contracts/NftMarketPlaceV2.json";

// addresses
import ContractAddress from "./config/contracts/map.json";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// connection to the blockchain
import { ethers } from "ethers";

// fetching general data (mainly used for IPFS links in this repo)
import axios from "axios";

// IPFS (NFT metadata gets stored on IPFS)
import { create } from "ipfs-http-client";
// needed for IPFS link
import { Buffer } from "buffer";

// UI library
import "bootstrap/dist/css/bootstrap.min.css";

// general theme set for our UI
import theme from "./Components/theme/theme";

function App() {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // WEB3MODAL

  // setting ProviderOptions for our possible Web3Modal connections

  const providerOptions = {
    // enabling logging with binance wallet
    binancechainwallet: {
      package: true,
    },

    // enabling logging with authereum wallet
    authereum: {
      package: Authereum, // required
    },

    // enabling logging with walletconnect
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_PORJECT_ID,
      },
    },

    // enabling logging with Coinbase wallet
    walletlink: {
      package: CoinbaseWalletSDK, // CoinbaseWalletSDK, // Required
      options: {
        appName: "Marketplace", // Required - random APP name
        infuraId: process.env.REACT_APP_PORJECT_ID, // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 5, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
  };

  // setting web3Modal with our prior declared possible provider Options
  const web3Modal = new Web3Modal({
    network: "goerli",
    theme: "dark", // optional
    cacheProvider: true,
    providerOptions,
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Provider, Signer, user address

  // handle State of account address
  const [account, setAccount] = useState("");

  // provider and signer
  const [isProviderSet, setIsProviderSet] = useState(false);

  // will be updated with the "Connect" button
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();

  // infuraProvider - used to load data from the blockchain, no matter if user connected wallet

  const infuraProvider = new ethers.providers.InfuraProvider("goerli", {
    projectId: process.env.REACT_APP_PROJECT_ID,
    projectSecret: process.env.REACT_APP_PROJECT_SECRET,
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // market
  const eventContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlaceV2,
    NftMarketPlace.abi,
    //infuraProvider //
    provider
  );
  //nft
  const eventContractNFT = new ethers.Contract(
    ContractAddress[5].NFTV2,
    NFT.abi,
    //infuraProvider //
    provider
  );
  const eventContractMarketInfura = new ethers.Contract(
    ContractAddress[5].NftMarketPlaceV2,
    NftMarketPlace.abi,
    infuraProvider
  );
  const eventContractNFTInfura = new ethers.Contract(
    ContractAddress[5].NFTV2,
    NFT.abi,
    infuraProvider
  );
  //signer calls
  //market
  const signerContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlaceV2,
    NftMarketPlace.abi,
    signer
  );
  //NFT

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //side loaded
  useEffect(() => {
    // if you remove loadOnSaleNFTs() web3modal stops working
    loadOnSaleNFTs();
    loadOwnNFTs(); // user provider
    loadMintedNFTs(); // user provider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //user connected with one of web3modal's providers
  useEffect(() => {
    // if you remove loadOnSaleNFTs() web3modal stops working
    loadOnSaleNFTs(); // infura provider
    loadOwnNFTs(); // user provider
    loadMintedNFTs(); // user provider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProviderSet]);

  //network
  const [network, setNetwork] = useState({
    chainId: "",
    name: "",
  });

  useEffect(() => {
    loadOwnNFTs(); // user provider
    loadMintedNFTs(); // user provider
    console.log("network changed and minted and owned NFTs refetched");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, account]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // -----------------------------------
  // Handle wallet connection
  // -----------------------------------

  const [instance, setInstance] = useState();

  let instance_M;

  /**
   * Version 1 (current version): Web3modal connection allows for using multiple wallet
   *
   * Version 2: Only allow connecting wallet through Metamask
   */

  async function connectWallet() {
    if (!instance) {
      // -----------------------------------
      // Web3modal; Version 1
      // -----------------------------------

      // web3modal allows the option of instantly saving provider in cache. We clear it because it can lead to bugs inside chrome
      await web3Modal.clearCachedProvider();

      // web3Modal opens and creates instance
      instance_M = await web3Modal.connect();
      setInstance(instance_M);

      // getting provider through web3modal instance
      const provider_M = new ethers.providers.Web3Provider(instance_M);

      // getting signer and saving current provider
      let signer_M = provider_M.getSigner();
      setProvider(provider_M);

      // get and safe current network
      let network_M = await provider_M.getNetwork();
      setNetwork({
        chainId: network_M.chainId,
        name: network_M.name,
      });

      // set signer
      setSigner(signer_M);

      // get and set user address
      const accounts = await provider_M.send("eth_requestAccounts");
      setAccount(accounts[0]);

      // disable connecting wallet button
      setIsProviderSet(true);
      console.log("isProvidetSet === true");
    }

    // ---------------------------------------------------------------------

    // -----------------------------------
    // Metamask; Version 2
    // -----------------------------------

    /* if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    } */
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // -----------------------------------
  // Only metamask version - Handle wallet change events
  // -----------------------------------

  //on chain change
  /* useEffect(() => {
    if (provider) {
      window.ethereum.on("chainChanged", handleChainChanged);
      console.log("triggered chains changed");
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        console.log("triggered chains changed");
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  //on account change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      console.log("triggered accounts changed");
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        console.log("triggered accounts changed");
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      console.log(accounts[0]);
      window.location.reload();
    }
  } */

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // -----------------------------------
  // Handle wallet change events
  // -----------------------------------

  async function handleChainChanged(chainId) {
    /* console.log(chainId); */
  }

  // handles user changed network ([goerli -> mainnet] e.g.)
  // saving network name and ID ([goerli; 5] e.g.)
  async function handleNetworkChanged(networkId) {
    /* console.log(networkId); */
    switch (networkId) {
      case "4":
        setNetwork({
          chainId: 4,
          name: "rinkeby",
        });
        break;

      case "1":
        setNetwork({
          chainId: 1,
          name: "mainnet",
        });
        break;

      case "5":
        setNetwork(
          /* (prevState) => ( */ {
            /* ...prevState, */
            chainId: 5,
            name: "goerli",
          } /* ) */
        );
        /* setNetwork({
          chainId: "5",
          name: "goerli",
        }); */
        break;
      case "42":
        setNetwork({
          chainId: 42,
          name: "kovan",
        });
        break;

      default:
        setNetwork({
          chainId: "",
          name: "",
        });
        window.alert("change Network to Goerli!");
        console.log(`Wrong network ${networkId}`);
    }
  }

  // handles user changing accounts and saves new address
  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      console.log(accounts[0]);
      loadMintedNFTs();
      loadOwnNFTs();
      /* window.location.reload(); */
    }
  }

  /**
   * Listeners for:
   * 1. network Change
   * 2. chain change
   * 3. account change
   */

  useEffect(() => {
    if (instance) {
      instance.on("chainChanged", handleChainChanged);
      instance.on("networkChanged", handleNetworkChanged);
      instance.on("accountsChanged", handleAccountsChanged);
      return () => {
        instance.removeListener("chainChanged");
        instance.removeListener("networkChanged");
        instance.removeListener("accountsChanged");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance]);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // closing web3modal - instance - clear provider

  // Logout helper
  // -----------------------------------
  async function logout() {
    web3Modal?.clearCachedProvider();
    if (
      instance &&
      instance.currentProvider &&
      instance.currentProvider.close
    ) {
      await instance.currentProvider.close();
    }
    web3Modal.clearCachedProvider();
    window.location.reload();
  }

  // -----------------------------------

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // -----------------------------------
  // Handle contract state change events
  // -----------------------------------

  useEffect(() => {
    eventContractNFTInfura.on(
      "marketItemCreated",
      (nftContractAddress, tokenId, price, onSale, owner, seller, minter) => {
        /*   if (minter === account) { */

        loadMintedNFTs();

        /*  } */
        console.log("marketItemCreated " + tokenId + " " + price);
      }
    );

    eventContractMarketInfura.on(
      "marketItemOnSale",
      (nftContractAddress, tokenId, price, onSale, owner, seller) => {
        loadOnSaleNFTs();
        console.log("market item for sale " + tokenId + " " + price);
      }
    );

    eventContractMarketInfura.on(
      "marketItemBought",
      (nftContractAddress, tokenId, price, onSale, owner, seller) => {
        loadOwnNFTs();
        console.log("market item bought " + tokenId + " " + price);
      }
    );

    //removing all old event Listeners
    return () => {
      eventContractNFTInfura.removeListener(
        "marketItemCreated",
        (nftContractAddress, tokenId, price, onSale, owner, seller, minter) => {
          /*  if (minter === account) { */

          loadMintedNFTs();

          /*    } */
          console.log("marketItemCreated " + tokenId + " " + price);
        }
      );
      eventContractMarketInfura.removeListener(
        "marketItemOnSale",
        (nftContractAddress, tokenId, price, onSale, owner, seller) => {
          loadOnSaleNFTs();
          console.log("market item for sale " + tokenId + " " + price);
        }
      );
      eventContractMarketInfura.removeListener(
        "marketItemBought",
        (nftContractAddress, tokenId, price, onSale, owner, seller) => {
          loadOwnNFTs();
          console.log("market item bought " + tokenId + " " + price);
        }
      );
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [ownNFTs, setOwnNFTs] = useState([]);

  async function axiosGetTokenData(data) {
    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        //change the format to something im familiar with
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,

          seller: index.seller,

          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    return tokenData;
  }

  async function loadOwnNFTs() {
    if (isProviderSet /* instance */ && network.chainId === 5) {
      let data = await signerContractMarket.fetchAllMyTokens();
      console.log(data);
      let tokenData = await axiosGetTokenData(data);

      setOwnNFTs(tokenData);
    }
  }

  const [onSaleNFTs, setOnSaleNFTs] = useState([]);

  async function loadOnSaleNFTs() {
    /*  if (network.chainId === 5) { */
    try {
      let data = await eventContractMarketInfura.fetchAllTokensOnSale();

      const tokenData = await Promise.all(
        data.map(async (index) => {
          //getting the TokenURI using the erc721uri method from our nft contract
          let tokenID = index.tokenId;
          const tokenUri = await eventContractNFTInfura.tokenURI(
            tokenID.toNumber()
          );

          //getting the metadata of the nft using the URI
          const meta = await axios.get(tokenUri);

          let nftData = {
            tokenId: index.tokenId,
            price: ethers.utils.formatUnits(index.price.toString(), "ether"),
            onSale: index.onSale,
            seller: index.seller,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          console.log(nftData);
          return nftData;
        })
      );
      setOnSaleNFTs(tokenData);
    } catch (error) {
      console.log(error);
    }
    /*  } */
  }

  const [mintedNFTs, setMintedNFTs] = useState([]);

  async function loadMintedNFTs() {
    if (isProviderSet /* instance */ && network.chainId === 5) {
      console.log("load Minted NFTS");
      const signerContractNFT = new ethers.Contract(
        ContractAddress[5].NFTV2,
        NFT.abi,
        signer
      );
      let data = await signerContractNFT.getMintedTokens();

      const tokenData = await Promise.all(
        data.map(async (index) => {
          //getting the TokenURI using the erc721uri method from our nft contract
          const tokenUri = await eventContractNFT.tokenURI(index);

          //getting the metadata of the nft using the URI
          const meta = await axios.get(tokenUri);

          //change the format to something im familiar with
          let nftData = {
            tokenId: index,
            price: 0 /* ethers.utils.formatUnits(index.price.toString(), "ether") */,
            onSale: false,
            /* owner: index.owner, */
            seller: "0x",
            /* minter: index.minter, */
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };

          return nftData;
        })
      );

      setMintedNFTs(tokenData);
    }
  }

  //uint256 _tokenId, address _nftContractAddress, value
  async function buyNFT(marketItem) {
    let id = marketItem.tokenId;
    id = id.toNumber();
    let price = marketItem.price;
    price = ethers.utils.parseEther(price);
    /* let tx = */ await signerContractMarket.buyMarketToken(
      id,
      /*  ContractAddress[5].NFT, */
      {
        value: price,
      }
    );
  }

  // BUG: inputting a [0,]... bugs the website
  // only [0.]..works as intended

  async function sellNFT(marketItem) {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[5].NftMarketPlaceV2,
      NftMarketPlace.abi,
      signer
    );
    const nftContract = new ethers.Contract(
      ContractAddress[5].NFTV2,
      NFT.abi,
      signer
    );
    let id = marketItem.tokenId;
    id = id.toNumber();
    await nftContract.setApprovalForAll(
      ContractAddress[5].NftMarketPlaceV2,
      true
    );
    /* let tx = */ await contract.sellMarketToken(
      id,
      previewPriceTwo /* ,
      ContractAddress[5].NFT */
    );
  }

  /* const [newNftAddress, setNewNftAddress] = useState();

  let nftAddressChange;

  const handleChangeNftAddress = (e) => {
    nftAddressChange = e.target.value;
    setNewNftAddress(nftAddressChange);
    console.log(nftAddressChange);
  }; */

  const [previewPriceTwo, setPreviewPriceTwo] = useState({});

  let previewPrice = 0;

  //BUG when using input field and using a nft button on a completely different nft its still submitting the input price
  //changing price from ether(user Input) into wei for contract
  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
    console.log(previewPriceTwo);
  };

  const projectId = process.env.REACT_APP_PORJECT_ID_IPFS; // <---------- your Infura Project ID

  const projectSecret = process.env.REACT_APP_PORJECT_SECRET_IPFS; // <---------- your Infura Secret

  const projectIdAndSecret = `${projectId}:${projectSecret}`;

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        "base64"
      )}`,
    },
  });

  //keeping track of URL inserted as image for NFT metadata
  const [fileURL, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({ name: "", description: "" });

  async function handleUrlChange(e) {
    //check e.target.files without target [0]
    // console.log(e.target.files)
    const file = e.target.files[0];
    // console.log(file)
    try {
      const added = await client.add(
        file
        /*, {
                    progress: (prog) => console.log(`received ${prog}`)
                }*/
      );
      //added is an object containing the path(hash), CID, and the size of the file
      //console.log(added)
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      setFileURL(url);
      // console.log(url)
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  async function createMarket() {
    if (!formInput.name || !formInput.description || !fileURL) {
      return;
    }
    //upload to IPFS but this time with metadata
    //the metadata comes from a json, we need to stringify the data to upload it
    const data = JSON.stringify({
      name: formInput.name,
      description: formInput.description,
      image: fileURL,
    });

    try {
      const added = await client.add(data);
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      //run a function that creates Sale and passes in the URL
      mintNFT(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  //creating the NFT(first mint at ContractAddress[5].NftMarketPlace, second create market Token at market address)
  async function mintNFT(url) {
    //make sure the user connected his wallet
    if (checkIfUserLoggedIn()) {
      //make sure the user is connected to the correct network
      if (checkIfUserConnectedToCorrectNetwork()) {
        let listingPrice = await eventContractMarket.getListingPrice();
        listingPrice = listingPrice.toString();

        let contract = new ethers.Contract(
          ContractAddress[5].NFTV2,
          NFT.abi,
          signer
        );

        await contract.createNFT(url, {
          value: listingPrice,
        });
      } else {
        window.alert("Change to the Goerli network");
      }
    } else {
      window.alert("You need to connect your wallet first");
    }
  }

  function changeFormInputDescription(e) {
    setFormInput({ ...formInput, description: e.target.value });
  }
  function changeFormInputName(e) {
    setFormInput({ ...formInput, name: e.target.value });
  }

  function changeNetworkToGoerli() {
    if (provider) {
      if (network.chainId === 5) {
        window.alert("already connected to Goerli!");
      } else {
        instance.request({
          /* method: "wallet_addEthereumChain", */
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: "0x5" },
            /*  {
              chainId: "0x5",
              rpcUrls: [
                "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
              ],
              chainName: "Goerli",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://goerli.etherscan.io"],
            }, */
          ],
        });
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // -----------------------------------
  // Restrict user access to certain functions while...
  // -----------------------------------

  /// check if the user connected his wallet
  function checkIfUserLoggedIn() {
    return account;
  }

  /// check if user is connected to the correct network(where NFT-marketplace/Nft contracts/... are deployed)
  function checkIfUserConnectedToCorrectNetwork() {
    if (network.chainId === 5) {
      return true;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header account={account} logout={logout} />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                account={account}
                networkChainId={network.chainId}
                networkName={network.name}
                handleUrlChange={handleUrlChange}
                mintNFT={mintNFT}
                onSaleNFTs={onSaleNFTs}
                buyNFT={buyNFT}
                connectWallet={connectWallet}
                changeNetworkToGoerli={changeNetworkToGoerli}
              />
            }
          />
          <Route
            exact
            path="/MintForm"
            element={
              <MintForm
                setFormInput={setFormInput}
                formInput={formInput}
                onChange={handleUrlChange}
                changeFormInputDescription={changeFormInputDescription}
                changeFormInputName={changeFormInputName}
                fileURL={fileURL}
                createMarket={createMarket}
                changeNetworkToGoerli={changeNetworkToGoerli}
                networkChain={network}
                connectWallet={connectWallet}
                instance={instance}
              />
            }
          />
          <Route
            exact
            path="/OwnNfts"
            element={
              <OwnNfts
                ownNFTs={ownNFTs}
                sellNFT={sellNFT}
                handleChangePrice={handleChangePrice}
                loadOwnNFTs={loadOwnNFTs}
                network={network}
                changeNetworkToGoerli={changeNetworkToGoerli}
                instance={instance}
                connectWallet={connectWallet}
              />
            }
          />
          {/*deletingNFT={deletingNFT} */}
          <Route
            exact
            path="/MintedTokens"
            element={
              <MintedTokens
                mintedNFTs={mintedNFTs}
                changeNetworkToGoerli={changeNetworkToGoerli}
                network={network}
                instance={instance}
                connectWallet={connectWallet}
                loadMintedNFTs={loadMintedNFTs}
              />
            }
          />
          <Route
            exact
            path="/BiconomyCrossChain"
            element={<BiconomyCrossChain />}
          />
          <Route exact path="/TransakGateway" element={<TransakGateway />} />
          <Route
            exact
            path="/NftHistory"
            element={
              <NftHistory
                infuraProvider={infuraProvider}
                account={account}
                checkIfUserConnectedToCorrectNetwork={
                  checkIfUserConnectedToCorrectNetwork
                }
                checkIfUserLoggedIn={checkIfUserLoggedIn}
              />
            }
          />
        </Routes>

        {/* <TextField
          variant={"filled"}
          placeholder="New NFT contract address"
          type="text"
          // maxLength="30"
          onChange={(e) => handleChangeNftAddress(e)}
        />
        <Button onClick={(e) => changeNftAddress(e)}>Change NFT address</Button> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
