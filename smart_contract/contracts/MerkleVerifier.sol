// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MerkleVerifier {
    address public owner;
    bytes32 public merkleRoot;

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // Constructor to set the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to set the Merkle root, callable only by the owner
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    // Function to verify if a transaction is included in the Merkle tree
    function verifyTransaction(bytes32[] memory proof, bytes32 transactionHash) public view returns (bool) {
        bytes32 computedHash = transactionHash;

        // Iterate over the proof and compute the hash from the leaves up to the root
        for (uint256 i = 0; i < proof.length; i++) {
            if (computedHash < proof[i]) {
                computedHash = keccak256(abi.encodePacked(computedHash, proof[i]));
            } else {
                computedHash = keccak256(abi.encodePacked(proof[i], computedHash));
            }
        }

        // The computed hash should match the stored Merkle root if the proof is valid
        return computedHash == merkleRoot;
    }
}
