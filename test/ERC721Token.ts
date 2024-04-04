import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { makeInterfaceId } from "@openzeppelin/test-helpers"

describe("ERC721Token", () => {
	const setupFixture = deployments.createFixture(async () => {
		await deployments.fixture()
		const signers = await getNamedAccounts()

		const contract = await ethers.deployContract("ERC721Token", await ethers.getSigner(signers.deployer))

		return {
			contract,
			contractAddress: await contract.getAddress(),
			deployer: signers.deployer,
			accounts: await ethers.getSigners(),
		}
	})

	describe("signedMint", function () {
		it("should mint a token with a valid signature", async function () {
			const { contract, accounts } = await setupFixture()
			const siguser = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(siguser)
			const mintuser = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
			const mintsigner = await ethers.getSigner(mintuser)
			const addressHash = ethers.solidityPackedKeccak256(["address"], [mintuser.toLowerCase()])
			const messageBytes = ethers.getBytes(addressHash)
			const signature = await signer.signMessage(messageBytes)

			await contract.connect(mintsigner).signedMint(signature)

			expect(await contract.ownerOf(1)).to.equal(mintuser)
		})

		it("should fail to mint with an already used signature", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)
			const addressHash = ethers.solidityPackedKeccak256(["address"], [user.toLowerCase()])
			const messageBytes = ethers.getBytes(addressHash)
			const signature = await signer.signMessage(messageBytes)

			await contract.connect(signer).signedMint(signature)

			await expect(contract.connect(signer).signedMint(signature)).to.be.revertedWith("Signature already used")
		})

		it("should fail to mint with an invalid signature", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720")
			const addressHash = ethers.solidityPackedKeccak256(["address"], [user.toLowerCase()])
			const messageBytes = ethers.getBytes(addressHash)
			const fakedSignature = await signer.signMessage(messageBytes)
			await expect(contract.connect(signer).signedMint(fakedSignature)).to.be.revertedWith(
				"SIGNATURE_VALIDATION_FAILED"
			)
		})
	})

	describe("mint", function () {
		it("should mint a token", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)

			await contract.connect(signer).mint(1, false, { value: ethers.parseEther("0.01") })

			await expect(await contract.ownerOf(1)).to.equal(user)
		})

		it("should fail to mint with an invalid value", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)

			await expect(contract.connect(signer).mint(1, false, { value: ethers.parseEther("0.001") })).to.be.reverted
		})

		it("should fail to mint with an invalid/over amount", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)

			await expect(contract.connect(signer).mint(4, false, { value: ethers.parseEther("0.04") })).to.be.reverted
		})

		it("should mint a set", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)

			await contract.connect(signer).mint(6, true, { value: ethers.parseEther("0.05") })

			await expect(await contract.ownerOf(6)).to.equal(user)
		})

		it("should fail to mint a set", async function () {
			const { contract, accounts } = await setupFixture()
			const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
			const signer = await ethers.getSigner(user)

			await expect(contract.connect(signer).mint(6, true, { value: ethers.parseEther("0.04") })).to.be.reverted
		})
	})
})
