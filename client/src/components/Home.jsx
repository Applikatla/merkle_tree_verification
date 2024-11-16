import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    name={name}
    onChange={handleChange}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Home = () => {
  const [Form, setForm] = useState({ transactions: "" });
  const [Proof, setProof] = useState();
  const [Transaction, setTransaction] = useState("");
  const {
    connectWallet,
        connectAccount,
        AccountId,
        setRoot,
        sendRoot,
        setHexProof,
        setTransactionHash,
        verify,
        ContractProof,
  } = useContext(TransactionContext);

  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      const body = Form;
      console.log(JSON.stringify(body));
      const res = await fetch("http://localhost:8000/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data.proof);
      setProof(data.proof);
      setRoot(data.root.data);
      setHexProof(data.hex);
      console.log(data.root.data);
      console.log(data.hex);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async () => {
    const res = await fetch("http://localhost:8000/merkle", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
  };

  const handleTransaction = async () => {
    try {
      const res = await fetch("http://localhost:8000/getsingletransaction", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setTransaction(data.transactions);
      setTransactionHash(data.transactions);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gradient-bg-services text-white home">
      {/* <div>Show context: {first} </div> */}
      {/* <button onClick={handleClick}>Click to fetch</button> */}
      <div className="flex items-center justify-center">
        <div className="p-5 sm:w-96 w-full blue-glassmorphism flex flex-col items-center">
          <h2 className="text-center text-white text-xl font-semibold mb-4">
            Mint
          </h2>
          <button
            className="w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-white"
            onClick={handleTransaction}
          >
            Get Transaction Id
          </button>
          <p>Transaction Id: {Transaction} </p>
          <Input
            placeholder="Copy Past Transaction Id"
            name="transactions"
            type="text"
            value={Form.transactions}
            handleChange={handleChange}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-white"
          >
            Mint merkle tree and proof
          </button>
          <p className="">Proof: {Proof ? "True" : "False"}</p>
          <p className="red">
            Note: Please click mint to generate Merkel tree before Store
          </p>
          <button
            className="w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-white"
            onClick={sendRoot}
          >
            Store Merkle Root
          </button>
          <button
            className="w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-white"
            onClick={verify}
          >
           Smart Contract Proof
          </button>
          <p className="">Proof: {ContractProof ? "False" : "True"}</p>
          {/* <button
            className="w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-white"
            onClick={handleClick}
          >
            Click to fetch
          </button> */}
          {!connectAccount && (
            <button
              onClick={connectWallet}
              className="blue-glassmorphism w-40 flex flex-row justify-center items-center my-5 hover:bg-[#2546bd]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
