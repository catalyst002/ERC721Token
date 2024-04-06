## Test task for Uddug

### Used Libraries

- **ERC721Enumerable**: Enhances our contract with the ability to enumerate NFTs directly, facilitating the retrieval of total supply and individual token enumeration without additional coding.
- **Ownable**: Integrates ownership management functionality, ensuring that only the owner can execute certain transactions.
- **ECDSA and MessageHashUtils**: These libraries are employed to implement signature verification. This feature is crucial for enabling backend signature minting, enhancing security and integrity.

### Core Functions

- **`mint`**: This function allows users to mint up to three NFTs per transaction an unlimited number of times. Alternatively, users can mint a set of six NFTs in a single transaction.
- **`signedMint`**: Designed for backend signature minting, this function permits the minting of one NFT, typically reserved for pre-mint by an allowlist.
- **`verifyAddressSigner`**: A utility function that verifies the signer of a signature for `signedMint`, ensuring the authenticity of minting requests.
- **`withdraw`**: Enables the contract owner to withdraw funds accumulated from the sale of NFTs, transferring the balance to their address.

### Test Coverage

- **Statements**: 95%
- **Branches**: 75%
- **Functions**: 66.7%
- **Lines**: 95.45%

### Project Structure

The structure organizes the project into several key directories, including contracts, deployment scripts, configurations, tasks, and tests, providing a clear and manageable framework for development and testing.

```
.
├── contracts
│   └── ERC721Token.sol
├── deploy
│   └── Deploy_ERC721Token.ts
├── deployments
├── hardhat.config.ts
├── tasks
│   ├── erc721
│   └── utils
└── test
    └── ERC721Token.ts
```

### Usage

#### Setup

##### 1. Install Dependencies

To install necessary dependencies, run:

```shell
npm install
```

#### Testing

##### Run Tests

Execute the command below to run tests:

```shell
npm run test
```

##### Run Coverage

To generate and view test coverage reports, use:

```shell
npm run coverage
```

---

### Project Hygiene

#### Formatting

- **Non-Solidity Files**: Use Prettier to ensure consistent formatting across non-Solidity files.
  - Check format: `npm run format:check`
  - Apply format: `npm run format:write`

- **Solidity Files**: Maintain code clarity and consistency in Solidity files with Prettier.
  - Check format: `npm run sol:format:check`
  - Apply format: `npm run sol:format:write`

#### Prettier - Solidity

```shell
npm run sol:format:check
npm run sol:format:write
```
