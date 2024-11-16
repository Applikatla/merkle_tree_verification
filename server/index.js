import axios from "axios";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = 8000;

app.use(cors());

app.use(express.json());

const yourAlchemyAPIKey = process.env.API_KEY;

const url = `https://eth-holesky.g.alchemy.com/v2/${yourAlchemyAPIKey}`;

// Define the block number you want to check
const blockNumberHex = '0x291988'; // Replace this with the hex of your block number

const payload = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_getBlockByNumber',
  params: [blockNumberHex, false]  // 'false' returns only transaction hashes
};

let transactionHashes = null; // Declare globally

const fetchTransactionHashes = async() => {
  try {
    const response = await axios.post(url, payload);
    transactionHashes = response.data.result.transactions;
    console.log('Transaction hashes in block:', transactionHashes);
  } catch (error) {
    console.error("Error fetching transaction hashes:", error);
  }
}
let MerkleTreeData = null;
let tree = null;
// Call the function to fetch the data



app.get('/getsingletransaction', async (req, res) => {
    fetchTransactionHashes().then(() => {
        let i = Math.floor(Math.random() * transactionHashes.length);
        res.json({transactions: transactionHashes[i]});
    })
})

app.get('/alltransactions', async (req, res) => {
    fetchTransactionHashes().then(() => {
        res.json({transactions: transactionHashes});
    })
})


app.get('/merkle', async (req, res) => {
    const merkleTree = await MerkleTreeData; 
    res.json({root: merkleTree.root, tree: merkleTree.tree});
})

app.post('/mint', async (req, res) => {
    fetchTransactionHashes().then(() => {
        const address = req.body.transactions;
        console.log(address);
        console.log("Global access to transaction hashes:", transactionHashes);
        const leaves = transactionHashes.map(tx => keccak256(tx));
        const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const claimingAddress = keccak256(address);
        const hexProof = merkleTree.getHexProof(claimingAddress);
        const rootHash = merkleTree.getRoot();
        const verifyProof = merkleTree.verify(hexProof, claimingAddress, rootHash);
        console.log(hexProof);
        console.log(verifyProof);
        res.json({ proof: verifyProof, hex: hexProof, root: rootHash });
        MerkleTreeData = {
          root: merkleTree.getRoot().toString('hex'),
          tree: merkleTree
        }
        console.log(MerkleTreeData);
      });
})

app.listen(port, () => {
    console.log(`server started at port ${port}`);
})
