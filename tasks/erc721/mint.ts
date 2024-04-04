import { task } from "hardhat/config"

/**
 Example:
 hardhat erc721-mint \
 --contract 0x77337983A7D1699FaF51a5f43b9907fB7B614097 \
 --recipient 0x73faDd7E476a9Bc2dA6D1512A528366A3E50c3cF \
 --network sepolia
 */
task("erc721-mint", "Mint token for BasicERC721 Smart Contract")
	.addParam<string>("contract", "BasicERC721 Smart Contract Address")
	.addParam<string>("recipient", "NFT Token Recipient")
	.setAction(async (taskArgs, { ethers }) => {
		const contract = await ethers.getContractAt("ERC721Token", taskArgs.contract)

		const mintTrx = await contract.mint(1, false, { value: 0.01 })

		console.log(`Transaction Hash: ${mintTrx.hash}`)
		await mintTrx.wait(2)
		console.log("Transaction confirmed")
	})
