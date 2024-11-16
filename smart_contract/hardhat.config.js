require('@nomicfoundation/hardhat-toolbox');
const dotenv = require('dotenv');

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    holesky: {
      url: 'https://eth-holesky.g.alchemy.com/v2/URsTZprMHu2Gbqs0fFdHnX7I0hSl5dkX',
      accounts: [process.env.PRIVATE_KEY],
      gas: 3000000,             // Increase if your contract requires more gas
      gasPrice: 30000000000,
    }
  }
};
