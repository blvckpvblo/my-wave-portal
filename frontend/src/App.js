import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");   // State variable to store user's public wallet
  const contractAddress = "0x50DFebAa71f2447dF3c859fE328757afCb13D9CD";   // The smart contract's address
  const contractABI = abi.abi;    // reference to the smart contract's abi
  const [isMining, setIsMining] = useState(false);
  const [totalWavesCount, setTotalWavesCount] = useState(0);  // State variable to store total waves
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;  // Check if we have access to window.ethereum

      if (!ethereum) {
        console.log("Make sure you have an Ethereum wallet!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /**
       * Check if we're authorized to access user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Connect user's wallet to the app
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /**
         * Execute wave function in the contract
         */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        setIsMining(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait()
        setIsMining(false);
        console.log("Mined --", waveTxn.hash);

        getTotalWaves();
        getAllWaves();
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWavesCount(count.toNumber());
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    wave();
  }

  function handleChange(event) {
    setMessage(event.target.value);
  }

  /**
   * Runs when the page loads
   */
  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalWaves();
    getAllWaves();

    /**
     * Listen to NewWave events
     */
    let wavePortalContract;

    const onNewWave = async (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    }
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am "𝓜𝓸𝓶𝓪𝓻 🌈☀️" and I am a techno-industrialist. Connect your Ethereum wallet and wave at me by sending me book recommendations!
        </div>

        <h1 style={{ textAlign: 'center' }}>
          # of Waves: {totalWavesCount}
        </h1>

        <form onSubmit={handleSubmit}>
          <textarea placeholder="Enter your book recommendations." value={message} onChange={handleChange}></textarea>

          <button className="waveButton">
            {!isMining && (<span>Wave at Me</span>)}
            {isMining && (<span>Mining...</span>)}
          </button>
        </form>

        {/**
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="message">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
