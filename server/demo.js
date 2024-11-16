import axios from "axios";

const yourAlchemyAPIKey = "URsTZprMHu2Gbqs0fFdHnX7I0hSl5dkX";

const url = `https://eth-holesky.g.alchemy.com/v2/${yourAlchemyAPIKey}`;

// Define the block number you want to check
const blockNumberHex = '0x291988'; // Replace this with the hex of your block number

const payload = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_getBlockByNumber',
  params: [blockNumberHex, false]  // 'false' returns only transaction hashes
};

let transactionHashes = null;

axios.post(url, payload)
  .then(response => {
    transactionHashes = response.data.result.transactions;
    console.log('Transaction hashes in block:', transactionHashes);
  })
  .catch(error => {
    console.error("Error fetching transaction hashes:", error);
  });


console.log("after axios: " + transactionHashes);