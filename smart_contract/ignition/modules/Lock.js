// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MerkleVerifierModule", (m) => {
  // Here you can set any parameters you want to pass into the constructor if needed.
  // For now, we'll assume there's no constructor parameter.
  
  // Deploy the MerkleVerifier contract
  const merkleVerifier = m.contract("MerkleVerifier", []);

  return { merkleVerifier };
});
