# Merkle Proof Verification for Blockchain Transactions

This project verifies the inclusion of a specific transaction from a blockchain block (on Sepolia or zkSync testnet) using Merkle proofs. The backend fetches transaction data from the blockchain, constructs a Merkle tree, and generates proofs. The frontend interacts with an Ethereum smart contract to verify the transaction inclusion using these proofs.

## Project Structure

- **Backend**: Uses Node.js and Express to fetch transactions, construct a Merkle tree, generate proofs, and serve data via API endpoints.
- **Smart Contract**: Written in Solidity, the contract stores a Merkle root and verifies proofs.
- **Frontend**: Built with React to interact with MetaMask, connect wallets, and communicate with the backend and the smart contract.

---

## Requirements

- **Node.js** and **npm** or **yarn**
- **MetaMask** for wallet connection
- **Ethereum Testnet** (Sepolia or zkSync) access and test funds
- **Alchemy API Key** for blockchain data

---

## Setup

1. Clone the Repository**
   ```bash
   https://github.com/Applikatla/merkle_tree_verification.git
   
2. Install Dependencies
    ```bash
   npm install

3. Configure Environment Variables Create a .env file in the root directory with your Alchemy API key:
     ```bash
   API_KEY=your-alchemy-api-key
---
## Backend

### Code Overview

1. **Endpoint: `/mint` (POST)**
   - **Description**: This endpoint accepts a request with transaction data and generates a Merkle proof for a specified transaction.
   - **Functionality**:
     - Fetches the transaction data from the blockchain using an API (e.g., Alchemy or another Ethereum provider).
     - Constructs a Merkle tree from the transaction data.
     - Generates a Merkle proof that proves the inclusion of a specific transaction in the Merkle tree.
     - Returns the Merkle root and proof in the response.

   - **Request Body Example**:
     ```json
     {
       "transactions": "0x1234567890abcdef1234567890abcdef12345678"
     }
     ```

   - **Response Example**:
     ```json
     {
       "proof": [ "0xabcdef...", "0x123456..." ],
       "root": { "data": "0xabcdef1234567890..." },
       "hex": [ "0xabcdef...", "0x123456..." ]
     }
     ```

2. **Endpoint: `/getsingletransaction` (GET)**
   - **Description**: This endpoint retrieves a single transaction hash from the specified Ethereum block.
   - **Functionality**:
     - Fetches the transaction hash for a block using the Alchemy API or any other Ethereum provider.
     - Returns the transaction hash that can be used for verification in the Merkle tree.

   - **Response Example**:
     ```json
     {
       "transactions": "0x1234567890abcdef1234567890abcdef12345678"
     }
     ```

3. **Endpoint: `/merkle` (GET)**
   - **Description**: This endpoint retrieves the stored Merkle root and tree structure from the backend.
   - **Functionality**:
     - Fetches the current Merkle root stored in the backend.
     - Returns the Merkle root along with the tree structure.

   - **Response Example**:
     ```json
     {
       "root": { "data": "0xabcdef1234567890..." },
       "tree": { "nodes": [ "0xabc...", "0xdef..." ] }
     }
     ```
    ## Running the Backend
   To start the backend server:
    ```
   npm start
     ```

## Smart Contract

### Code Overview

The smart contract provides the following functions:

1. **setMerkleRoot(bytes32 _merkleRoot)**  
   - **Description**: Stores the Merkle root. This function is restricted to the contract owner, ensuring that only the root can be updated by the authorized user.
   - **Usage**: Used to store the Merkle root generated from the backend. This root will be later used for verification.
   
2. **verifyTransaction(bytes32[] memory proof, bytes32 transactionHash)**  
   - **Description**: Verifies the inclusion of a specific transaction in the Merkle tree using the provided Merkle proof and transaction hash.
   - **Usage**: Allows users to submit a Merkle proof and transaction hash to check if the transaction is included in the Merkle tree.

### Deploy the Contract

To deploy the smart contract to the Sepolia or zkSync testnet, follow these steps:

1. **Using Remix IDE**:  
   - Go to [Remix IDE](https://remix.ethereum.org/).
   - Create a new Solidity file and paste the contract code into it.
   - Choose the **Solidity compiler** version matching your contract.
   - Select the **Deploy & Run Transactions** plugin, set the environment to **Injected Web3** (for MetaMask connection), and select the Sepolia or zkSync testnet.
   - Deploy the contract and make sure to **copy the contract address** after deployment.

2. **Using Truffle or Hardhat**:
   - Alternatively, you can use Truffle or Hardhat to deploy the smart contract to Sepolia or zkSync.
   - Make sure to configure the appropriate network settings in the deployment configuration files.

3. **Configure Frontend**:  
   After deployment, update the **contract address** in the frontend (in `contractAddress.js` or similar) with the newly deployed contract address on Sepolia or zkSync.

   Example:
   ```javascript
   export const contractAddress = "0xYourDeployedContractAddress";

## Frontend

### Code Overview

#### Components:

- **TransactionContext.jsx**: A context provider that centralizes state management and handles interactions with the Ethereum smart contract. This component provides critical functionality to manage the state and connect various blockchain interactions within the application, such as:
  - **State Management**: Maintains the connected wallet address (`connectAccount`), transaction root, proof data, verification status, and other contract-related information.
  - **Core Functions**:
    - `connectWallet`: Connects the application to MetaMask, allowing the user to interact with the Ethereum network.
    - `sendRoot`: Stores the Merkle root on the smart contract by invoking `setMerkleRoot`.
    - `verify`: Calls the `verifyTransaction` function on the smart contract to check if a transaction is included in the Merkle tree using the generated proof.
    - `checkIfWalletIsConnected`: Checks if MetaMask is connected on page load.
  - **Global Access**: This context enables any component in the app to access blockchain data, providing a seamless way to connect with Ethereum.

- **Home.jsx**: The main component that consumes `TransactionContext` to interact with the backend and the smart contract. Key functionalities include:
  - **Fetching Transactions**: Retrieves transaction IDs from the backend for use in Merkle proof generation.
  - **Minting Merkle Proofs**: Requests proof and root generation from the backend, sending the transaction ID for verification.
  - **Storing the Merkle Root**: Invokes `sendRoot` from `TransactionContext` to store the generated Merkle root on the smart contract.
  - **Verifying Transaction Proofs**: Calls the `verify` function to validate if the transaction exists in the Merkle tree by using proofs.
  - **User Interface**: Renders input fields, status messages, and buttons for wallet connection, minting proofs, storing roots, and verifying proofs.

- **Input**: A custom input field component for entering transaction details used in Merkle proof generation and verification.

  ## Running the Frontend
  To start the frontend, run:
  ```
    npm run dev
  ```

### Example Usage

### Connect Wallet
1. Open the frontend in your browser.
2. Click the **Connect Wallet** button to link your MetaMask account. This allows you to interact with the blockchain through the app.

### Mint Proof
1. Click **Get Transaction ID** to retrieve a transaction hash from the specified block.
2. After a transaction ID is displayed, enter it in the input field.
3. Click **Mint Merkle Tree and Proof** to generate the Merkle proof and root for the transaction. The proof data will be displayed if successful.

### Store Merkle Root
1. After generating the Merkle proof and root, click **Store Merkle Root** to save the root in the smart contract on the blockchain.

### Verify Proof
1. To check if the transaction exists in the Merkle tree, click **Smart Contract Proof**.
2. The app will verify the proof on the smart contract, confirming whether the transaction is part of the tree.
3. If successful, a message or indicator will show the verification result.

These steps walk you through connecting your wallet, generating and storing Merkle proofs, and verifying transaction inclusion using the smart contract.
