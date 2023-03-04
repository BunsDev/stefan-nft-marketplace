//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

// IMPORTS 
// debug tool
import "hardhat/console.sol";
// TokenURI Storage used to handle ipfs nft-links
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// LIBRARIES
// keeping state of tokenURI
import "@openzeppelin/contracts/utils/Counters.sol";

/// @dev Biconomy gasless transactions
import "./Gasless/ERC2771Recipient.sol";


// ERROR MESSAGES
// caller is not the owner nor has approval for tokenID
error NotOwner(address sender, uint i);
error NftMarketPlace__DidNotPayLISTINGPRICE(uint value);


// CONTRACTS
/// @title NFT contract for "Ape Family"
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Contract used to create new NFT's and keep state of previous ones
/// @dev Basic erc721 contract for minting, saving tokenURI and burning tokens  
// Please NOTE: I've added custom error messages in this version due to gas efficiency BUT due to the unconvential 
// syntax I have also added the require statements in the comments for a less gas efficient but more readable alternative.
contract NFTV2 is ERC721URIStorage, ERC2771Recipient {

     // BICONOMY

    string public override versionRecipient = "v0.0.1";

    function _msgSender() internal override (Context, ERC2771Recipient) view returns (address) {
        return ERC2771Recipient._msgSender();
    }

    
    function _msgData() internal override (Context, ERC2771Recipient) view returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// @notice decrement, increment, current ID from Counter library
    using Counters for Counters.Counter;

    /// @notice keeping track of tokenIds
    Counters.Counter public s_tokenIds;

    /// @notice address of the marketplace I want the this type of NFT to interact with
    address private immutable i_marketplace;
    


    /////////////////////

    /// @notice user Address => All TokenIDs minted by user
    mapping(address => uint[]) private addressMinted;

    function getMintedTokens() external view returns( uint[] memory) {
        return addressMinted[_msgSender()];
    }

    /// @notice fee to list a NFT on the marketplace
    uint256 constant public LISTINGPRICE = 0.002 ether;

    /* /// @notice Market Token that gets minted every time someone mints on our market
    /// @dev struct representing our MarketToken and its values at any given time
    struct MarketToken {
        address nftContractAddress; // not needed anymore?
        uint256 tokenId;
        uint256 price;
        // saving onSale and owner inside one 1 storage slot.
        bool onSale;
        address payable owner;
        address payable seller;
        address minter;
    } */

    /// @notice indexing from ID to the associated market Token
    /* mapping(uint256 => MarketToken) public idToMarketToken; */

    ////////////////////

     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // EVENTS   

    /// @notice signal used to update the website in real time after mint
    /// @dev adding marketItemCreate log
    event marketItemCreated(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        uint256 price,
        bool onSale,
        address indexed owner,
        address seller,
        address minter
    );

    ///////////////////////////////////////////////

    /// @notice setting name, symbol to fixed values
    constructor(address _marketplace, address forwarder) ERC721("Ape Family", "APF") {
        i_marketplace = _marketplace;
        _setTrustedForwarder(forwarder);
    }

    /// @notice mint function(createNFT)
    /// @return current tokenID
    function createNFT(string memory tokenURI) payable external returns (uint256) {

        if(msg.value != LISTINGPRICE ){
            revert NftMarketPlace__DidNotPayLISTINGPRICE( msg.value);
        } 


        // incrementing the id everytime after minting
        s_tokenIds.increment();
        // unique current ID
        uint256 currentTokenId = s_tokenIds.current();

        // ERC721 _mint
        _safeMint(_msgSender(), currentTokenId);

        // ERC721URIStorage _setTokenURI
        _setTokenURI(currentTokenId, tokenURI);

        // ERC721 setApprovalForAll to give marketplace access 
        setApprovalForAll(i_marketplace, true);

        /////////////////   

        addressMinted[_msgSender()].push(currentTokenId);


        /// @dev we do not to worry about potential reentrancy or denial of service attack
        // because the receiver address is our marketplace and we are aware of no potential 
        // security issues in the fallback/receive function and/or blocking the receive of ether through standard txs

        (bool success, ) = i_marketplace.call{value: msg.value}("");

        require(success, "listingPrice transfer wasn't successfull");

       /*  /// @dev create MarketToken with current ID and save inside mapping
        idToMarketToken[currentTokenId] = MarketToken(
            address(this),
            currentTokenId,
            0,
            false,
            payable(_msgSender()),
            payable(address(0)),
            _msgSender()
        );

        


        /// @dev adding listing price to contract s_profits
        // send to marketplace - no reentracy security issue, s_profits += msg.value; */
        emit marketItemCreated(address(this), currentTokenId, 0, false, _msgSender(),address(0),_msgSender());

        ///////////////////

        return currentTokenId;
    }

    
    

   
}
