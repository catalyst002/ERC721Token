
## Project Structure

```text
.
├── contracts
│   └── ERC721Token.sol
├── deploy
│   └── Deploy_ERC721Token.ts
├── deployments
├── hardhat.config.ts
├── tasks
│   ├── erc721
│   └── utils
└── test
    └── ERC721Token.ts
```

## Usage

### Setup

#### 1. Install Dependencies

```shell
npm install
```

### Testing

#### Run Tests

```shell
npm run test
```

#### Run Coverage

```shell
npm run coverage
```

---

### Project Hygiene

#### Prettier - Non Solidity Files

```shell
npm run format:check
npm run format:write
```

#### Prettier - Solidity

```shell
npm run sol:format:check
npm run sol:format:write
```
