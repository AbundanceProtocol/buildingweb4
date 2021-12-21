import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import Pages from './Pages'
import './index.css';
import Web3 from 'web3'


// const loadBlockchainData = async () => {
//     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//     const network = await web3.eth.net.getNetworkType()
//     const accounts = await web3.eth.getAccounts()
//     console.log("network:", network)
//     console.log("account:", accounts[0])
// }

function App() {
  // loadBlockchainData()
  const [accounts, setAccounts] = useState([]);

  const getAccounts = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    const accounts = await web3.eth.getAccounts()
    console.log("network:", network)
    console.log("account:", accounts[0])
    setAccounts(accounts)
  }

  useEffect( () => {
    getAccounts()
    // console.log(accounts)
  },[] )

  return (
    <div>
      <Pages />
      {accounts}
    </div>
  )
}

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);