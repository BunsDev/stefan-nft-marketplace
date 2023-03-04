// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// IMPORTS ------------------------------------------------------------------------------------
/// @notice debugging tool
import "hardhat/console.sol";
/// @dev to interact the transferFrom method
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
/// @dev security against transactions with multiple requests
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/// @dev Biconomy gasless transactions
import "./Gasless/ERC2771Recipient.sol";



// INTERFACES ----------------------------------------------------------------------------

interface IDutchAuctionFactory {
    function createDutchAuction(uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId) external;
}

interface IEngAuctionFactory {
    function createEngAuction(address _nft,
        uint _nftId,
        uint _startingBid) external;
}

interface INFT{
    function s_tokenIds() external view returns(uint);
}


// LIBRARIES ------------------------------------------------------------------------------------
/// @notice Counter Library to keep track of TokenID
import "@openzeppelin/contracts/utils/Counters.sol";

// ERROR MESSAGES ------------------------------------------------------------------
error NftMarketPlace__NotOwnerOfToken(address sender, uint tokenId);
error NftMarketPlace__invalidSellPrice(address sender, uint valueSend);
error NftMarketPlace__TokenAlreadyOnSale(uint tokenId );
error NftMarketPlace__DidNotPayLISTINGPRICE(uint value);
error NftMarketPlace__NotOwnerOfContract(address requester);
error NftMarketPlace__TokenIdUnderOne(uint tokenId);
error NftMarketPlace__TokenNotOnSale(uint tokenId);
error NftMarketPlace__UnequalToSellPrice(uint valueSend);
error NftMarketPlace__CallerIsOwnerOfToken(address caller, uint tokenId);

// CONTRACTS ------------------------------------------------------------------------------------
/// @title NFT Marketplace 
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Contract used to allow trading, selling, creating Market Items (NFT)
/// @dev Please NOTE: I've added custom error messages in this version due to gas efficiency BUT because of the unconvential 
// syntax I have also added the require statements in the comments for a less gas efficient but more readable alternative.
contract NftMarketPlaceV2 is ReentrancyGuard, ERC2771Recipient{

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Type declarations, State Variables 

    /// @dev making use of counter library for Counters.Counter
    using Counters for Counters.Counter;

    /// @notice keeping track of tokenID 
    Counters.Counter private s_tokenIds;

    /// @notice fee to list a NFT on the marketplace
    uint256 constant public LISTINGPRICE = 0.002 ether;


    /// @notice Market Token that gets minted every time someone mints on our market
    /// @dev struct representing our MarketToken and its values at any given time
    struct MarketToken {
        // can be added to make the contract more dynamic in the future: 
        // address nftContractAddress;
        uint256 tokenId;
        uint256 price;
        // saving onSale and seller inside one 1 storage slot.
        bool onSale;
        address payable seller;
    }

    /// @notice indexing from ID to the associated market Token
    mapping(uint256 => MarketToken) public idToMarketToken;

    /// @notice s_profits of the contract from "listingPrice" fees
    uint256 private s_profits;

    // this can be private in the future
    address private nftAddress  = 0x0000000000000000000000000000000000000000;

    /// @notice contract deployer
    address immutable private i_owner;


    // versioning needed for biconomy gasless tx
    string public override versionRecipient = "v0.0.1";
    

    address private immutable i_dutchFactoryContract;
    address private immutable i_engFactoryContract;
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // EVENTS   

    
    /// @notice signal used to update the website in real time after putting item on sale
    event marketItemOnSale(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller
      
    );
    /// @notice signal used to update the website in real time after item has been bought
    event marketItemBought(
        address indexed nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller
      
    );
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // MODIFIERS 
    
   /*  // In Case modifiers and requires get more gas efficient in the future
    /// @notice checking if correct listing price has been paid
    /// @dev modifer to get the exact listing price
    modifier paidListingPrice() {
        require(msg.value == LISTINGPRICE, "You need to pay the LISTINGPRICE");
        _;
    } */

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // FUNCTIONS 
    /// @notice setting owner to contract deployer
    constructor(address _DutchAuctionFactory, address _EngFactoryContract, address forwarder) {
        i_owner = payable(_msgSender());
        i_dutchFactoryContract = _DutchAuctionFactory;
        i_engFactoryContract = _EngFactoryContract;
        _setTrustedForwarder(forwarder);
    }

    /// @notice used for tips and listingprice from NFT contract to project creator/deployer
    fallback() payable external {
        s_profits += msg.value;
    }


    // BICONOMY

    function _msgSender() internal override ( ERC2771Recipient) view returns (address) {
        return ERC2771Recipient._msgSender();
    }

    
    function _msgData() internal override ( ERC2771Recipient) view returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }



    /// @notice A way for the contract owner to withdraw his profits, tips/minting fees
    function withdrawContractsProfits() external nonReentrant {
        if(_msgSender() != i_owner){
            revert NftMarketPlace__NotOwnerOfContract(_msgSender());
        }
        /* require(_msgSender() == i_owner, "only the owner can call this function"); */
        (bool success, ) = payable(_msgSender()).call{value: s_profits}("");
        require(success, "Payment wasn't successfull");
        s_profits = 0;
    }

    
    
    /// @notice sell NFT
    /// @dev putting market Token for sale on marketplace
    /// @param _tokenId tokenID of NFT putting up for sale, sellPrice the price you want the NFT to be sold for, _nftContractAddress contract address of the NFT you want to sell 
    function sellMarketToken(
        uint256 _tokenId,
        uint256 sellPrice /* , */
        // address _nftContractAddress
    ) external {
        if(sellPrice <= 0){
            revert NftMarketPlace__invalidSellPrice(_msgSender(), sellPrice);
        }
        if(idToMarketToken[_tokenId].onSale == true){
            revert NftMarketPlace__TokenAlreadyOnSale(_tokenId);
        }
        if(IERC721(nftAddress).ownerOf(_tokenId) != _msgSender()){
            revert NftMarketPlace__NotOwnerOfToken(_msgSender(), _tokenId);
        }
        /* /// @dev sell price must be > 0 Wei
        require(sellPrice > 0, "Price must be atleast one wei");
        /// @dev token can't be on sale already
        require(
            idToMarketToken[_tokenId].onSale == false,
            "The token is already on sale"
        );
        /// @dev seller must be owner
        require(
            idToMarketToken[_tokenId].owner == _msgSender(),
            "only owner of token can call this method"
        ); */
        /// @dev transferring the NFT created in given contract address from current caller to this marketplace
        IERC721(nftAddress).transferFrom(
            _msgSender(),
            address(this),
            _tokenId
        );

        /// @dev updating state of for sale listed NFT
        idToMarketToken[_tokenId] = MarketToken(_tokenId, sellPrice, true, payable(_msgSender()));
       emit marketItemOnSale(
         nftAddress,
        _tokenId,
        sellPrice,
        true,
        msg.sender,
        msg.sender
        );
    }

    /// @notice buy NFT
    /// @dev buy market Token which is currently up for sale
    /// @param _tokenId token ID of market Token chosen to be bought, _nftContractAddress contract address of NFT chosen to be bought
    function buyMarketToken(uint256 _tokenId //, address _nftContractAddress
    )
        external
        payable nonReentrant 
    {   
        if(_tokenId <= 0){
            revert NftMarketPlace__TokenIdUnderOne(_tokenId);
        }
        if(idToMarketToken[_tokenId].onSale != true){
            revert NftMarketPlace__TokenNotOnSale(_tokenId);
        }
        if(msg.value != idToMarketToken[_tokenId].price){
            revert NftMarketPlace__UnequalToSellPrice(msg.value);
        }
        if(_msgSender() == IERC721(nftAddress).ownerOf(_tokenId)){
            revert NftMarketPlace__CallerIsOwnerOfToken(_msgSender(), _tokenId);
        }
        if(_msgSender() == idToMarketToken[_tokenId].seller){
            revert NftMarketPlace__CallerIsOwnerOfToken(_msgSender(), _tokenId);
        }
        /* /// @dev require existing ID
        require(_tokenId > 0, "TokenId must be over 0");
        require(
            msg.value == idToMarketToken[_tokenId].price,
            "Message value must be equal to sellPrice"
        );
        require(
            idToMarketToken[_tokenId].onSale == true,
            "NFT must be up for sale"
        );
        require(
            _msgSender() != idToMarketToken[_tokenId].owner,
            "You cannot buy from yourself (atleast not with the same address)"
        ); */

       
        /// @dev transferring NFT created in given address from this marketplace to the _msgSender() (buyer)
        IERC721(nftAddress).transferFrom(
            address(this),
            _msgSender(),
            _tokenId
        );

        /// @dev transferring the eth from contract (provided by buyer) to the seller of the nft
        payable(idToMarketToken[_tokenId].seller).transfer(msg.value);

        /// @dev update the state of bought market Token
        delete idToMarketToken[_tokenId];
        emit marketItemBought(
        nftAddress,
        _tokenId,
        idToMarketToken[_tokenId].price,
        false,
        IERC721(nftAddress).ownerOf(_tokenId),
        IERC721(nftAddress).ownerOf(_tokenId)
        );
    
    }

    /// @notice getting all tokens which are currently up for sale
    /// @return array of Market Tokens currently up for sale
    function fetchAllTokensOnSale() external view returns (MarketToken[] memory) {

        /// @dev saving current ID to save some gas
        /// @dev getting the current last token ID of our nft contract.
        uint256 currentLastTokenId = INFT(nftAddress).s_tokenIds();
        
        uint256 tokensOnSale;
        /// @dev loop to get the number of tokens on sale
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                tokensOnSale += 1;
            }
        }

        /// @dev creating a memory array with the length of num "of tokens on sale"
        MarketToken[] memory res = new MarketToken[](tokensOnSale);
        uint256 count = 0;

        /// @dev updating the memory array with all market tokens with onSale == true
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    
    /// @dev setting the address of the NFT contract we want to interact with
    function setNftAddress(address _nftAddress) external {
        if(_msgSender() != i_owner){
            revert NftMarketPlace__NotOwnerOfContract(_msgSender());
        }
        nftAddress = _nftAddress;
    }


    /// @notice getting all tokens which currently belong to _msgSender()
    /// @return array of Market Tokens which currently belong to _msgSender(), currently doesn't track tokens the msg.Sender is 
    /// selling through the marketplace
    function fetchAllMyTokens() external view returns (MarketToken[] memory) {
    
        uint256 sumOfAllCallerNFTs = IERC721(nftAddress).balanceOf(_msgSender());
        console.log(sumOfAllCallerNFTs);
        uint counter;
       
        MarketToken[] memory resultArray = new MarketToken[](sumOfAllCallerNFTs);
        
        // remove unnessary outputs
        for(uint i = 1; counter < sumOfAllCallerNFTs ; i++){
           address owner =  IERC721(nftAddress).ownerOf(i);
           if(owner == _msgSender()){
            
            resultArray[counter] = MarketToken(  
                i,
                0,
                false,
                payable(_msgSender())
                );
                counter++;
            }   
        }
        return resultArray;
    }

    /// @notice returns all market tokens
    /// @return array of all market tokens
    function fetchAllTokens() external view returns (MarketToken[] memory) {
        
        /// @dev saving current ID to save some gas
        /* uint currentLastTokenId = IERC721(nftAddress).totalSupply(); */
        uint256 currentLastTokenId = INFT(nftAddress).s_tokenIds();

        MarketToken[] memory resultArray = new MarketToken[](currentLastTokenId);

          // remove unnessary outputs
        for(uint i = 1; i <= currentLastTokenId ; i++){
            resultArray[i] = MarketToken(  
                i,
                0,
                false,
                payable(_msgSender())
                );
        }
        return resultArray;
    }

    function McreateDutchAuction(uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId) external {
        IDutchAuctionFactory(i_dutchFactoryContract).createDutchAuction(_startingPrice,
        _discountRate,
        _nft,
       _nftId);
    }

    function McreateEngAuction(address _nft,
        uint _nftId,
        uint _startingBid) external {
        IEngAuctionFactory(i_engFactoryContract).createEngAuction(_nft,
       _nftId,
        _startingBid);
    }

    /// @return listing price
    function getListingPrice() external pure returns(uint){
        return LISTINGPRICE;
    }
}