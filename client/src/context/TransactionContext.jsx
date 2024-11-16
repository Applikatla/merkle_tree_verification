import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../utils/constance";
export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  if (!ethereum) throw new Error("Ethereum object not found");
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  console.log(transactionContract);
  return transactionContract;
};


export const TransactionProvider = ({ children }) => {

  const [connectAccount, setConnectAccount] = useState("");

  const [AccountId, setAccountId] = useState("");

  const [Root, setRoot] = useState();

  const [HexProof, setHexProof] = useState([]);

  const [TransactionHash, setTransactionHash] = useState("");

  const [ContractProof, setContractProof] = useState()

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setConnectAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
      setAccountId(accounts);
      console.log(accounts);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  const sendRoot = async (e) => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const transactionContract = getEthereumContract();
      // const gasPrice = await provider.getGasPrice();
      // const rootBytes32 = ethers.utils.arrayify(Root);
      const tx = await transactionContract.setMerkleRoot(Root);
      const hash = await tx.hash;
      alert("transaction hash: "+ hash);
      console.log(tx); 
      console.log(Root);
    } catch (error) {
      console.log(error);
    }
  }
  const verify = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const transactionContract = getEthereumContract();
      const proofByte32 = HexProof.map((proof) => ethers.utils.arrayify(proof));
      const transactionHashBytes32 = ethers.utils.arrayify(TransactionHash);
      const tx = await transactionContract.verifyTransaction(proofByte32, transactionHashBytes32);
      const data = await tx;
      setContractProof(data);
      console.log("data: " + data);
      console.log(TransactionHash);
      console.log(proofByte32);
      console.log(transactionHashBytes32);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        connectAccount,
        AccountId,
        setRoot,
        sendRoot,
        setHexProof,
        setTransactionHash,
        verify,
        ContractProof,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};