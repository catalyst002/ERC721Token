// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing necessary components from OpenZeppelin's contracts library
// ERC721Enumerable adds enumeration functionality on top of the basic ERC721 standard.
// Ownable provides basic authorization control functions.
// ECDSA and MessageHashUtils are used for cryptographic operations, particularly for signature verification.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// ERC721Token is an ERC721 token that includes enumerable functionality and is ownable.
contract ERC721Token is ERC721Enumerable, Ownable {
	using ECDSA for bytes32; // Enables the use of ECDSA functions for bytes32 types.
	using MessageHashUtils for bytes32; // Enables the use of MessageHashUtils functions for bytes32 types.

	// Constant values that define the token's economics and constraints
	uint256 public constant TOKEN_PRICE = 0.01 ether;
	uint256 public constant SET_PRICE = 0.05 ether;
	uint256 public constant MAX_SUPPLY = 1000;
	uint256 public constant MAX_MINT_PER_TX = 3;

	// Mappings to keep track of unique actions or states
	mapping(address => bool) public hasMintedSet; // Tracks whether an address has minted a set
	mapping(bytes => bool) public usedSignatures; // Tracks whether a signature has been used

	// Address of the signer, used for signature verification in signedMint
	address private signerAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

	// Event emitted when a set is minted
	event SetMinted(uint256 startIndex, address minter);

	// Constructor for the contract. Sets the token name and symbol and transfers ownership to the contract deployer.
	constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {}

	// Function to mint tokens. Can mint a specific number of tokens or a set.
	// Checks for max supply, whether a set can be minted, and correct payment.
	function mint(uint256 numberOfTokens, bool mintSet) public payable {
		require(
			totalSupply() + numberOfTokens <= MAX_SUPPLY,
			"Exceeds max supply"
		);

		if (mintSet && (numberOfTokens == 6)) {
			require(
				!hasMintedSet[msg.sender],
				"Address has already minted a set"
			);
			require(SET_PRICE <= msg.value, "Ether value sent is not correct");
			uint256 startIndex = totalSupply() + 1;
			for (uint256 i = 0; i < numberOfTokens; i++) {
				_mint(msg.sender, startIndex + i);
			}

			hasMintedSet[msg.sender] = true;
			emit SetMinted(startIndex, msg.sender);
		} else {
			require(
				numberOfTokens <= MAX_MINT_PER_TX,
				"Exceeds max mint amount per transaction"
			);
			require(
				TOKEN_PRICE * numberOfTokens <= msg.value,
				"Ether value sent is not correct"
			);

			uint256 startIndex = totalSupply() + 1;
			for (uint256 i = 0; i < numberOfTokens; i++) {
				_mint(msg.sender, startIndex + i);
			}
		}
	}

	// Function to mint a token using a signature for authorization.
	// Verifies the signature against a predefined signer address.
	function signedMint(bytes memory signature) public {
		require(!usedSignatures[signature], "Signature already used");
		require(verifyAddressSigner(signature), "SIGNATURE_VALIDATION_FAILED");
		require(totalSupply() + 1 <= MAX_SUPPLY,
			"Exceeds max supply"
		);

		usedSignatures[signature] = true;
		_mint(msg.sender, totalSupply() + 1);
	}

	// Private function to verify the signer of a message.
	// Encodes the sender's address, hashes it, and checks the signature.
	function verifyAddressSigner(
		bytes memory signature
	) private view returns (bool) {
		bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
		return
			signerAddress ==
			messageHash.toEthSignedMessageHash().recover(signature);
	}

	// Function to withdraw funds
	function withdraw() public onlyOwner {
		payable(address(owner())).call{ value: address(this).balance }("");
	}

	fallback() external payable {}
}
