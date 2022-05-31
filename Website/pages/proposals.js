
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import { Warning } from './assets'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Proposals(props) {
  const { proposals, address } = props
  const [searchAddress, setSearchAddress] = useState(address)
  const account = useContext(AccountContext)
  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }

	function shortenName(longName) {
		if (longName) {
			let shortName = (longName.slice(0, 5) + '...' + longName.slice(38, 42))
			return shortName
		}
		return null
	}


  async function proposalBid(e) {
    console.log('bid on', e.target.name)
  }

  async function proposalFund(e) {
    console.log('bid on', e.target.name)
  }

  function timeCoverter(epoch) {
    let date = new Date(epoch * 1000)
    return date.toLocaleString()
  }

  return (
    <div style={{padding: '130px 0 0 0'}}>
      <Warning />
      <div className="top-frame">
        {
          <div className="data-container">
            <span className="container-title">Search Funding Requests</span>
          </div>
        }
      </div>

      <div className="">
        {
          proposals.map((proposal, index) => (
            <div className="flex-row data-container" key={index}>
              <div className="flex-col" style={{width: '100%'}}>
                <span className=""><span style={{fontWeight: '600'}}>User: </span>{shortenName(searchAddress)}</span>
                <span className=""><span style={{fontWeight: '600'}}>Amout requested: </span>{proposal.amountRequested} WEB</span>
                <span className=""><span style={{fontWeight: '600'}}>Return rate: </span>{proposal.returnRate}%</span>
                <span className=""><span style={{fontWeight: '600'}}>Funding type: </span>{proposal.reqType === 0 ? "Auction" : "Request"}</span>
                <span className=""><span className="" style={{fontWeight: '600'}}>{proposal.reqType === 0 ? "Deadline: " : ''}</span>{proposal.reqType === 0 ? (timeCoverter(proposal.deadline)) : ''}</span>
              </div>
              { (proposal.reqType === 0) &&
                (
                  <input type="button" onClick={proposalBid} name={proposal.reqId} value="Bid" className="input-toggle-button toggle-on" />
                )
              }
              { (proposal.reqType === 1) &&
                (
                  <input type="button" onClick={proposalFund} name={proposal.reqId} value="Fund" className="input-toggle-button toggle-on" />
                )
              }
            </div>
          ))
        }

      </div>
    </div>
  )
}


export async function getServerSideProps() {
  let provider 
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }
  const contract = new ethers.Contract(contractAddress, Abundance.abi, provider)
  const data = await contract.getAllFundingReqs('0xc6FD734790E83820e311211B6d9A682BCa4ac97b')

  let parsedData = JSON.parse(JSON.stringify(data))
  const sortedData = parsedData.map(d => (
    { 
      reqId: parseInt(Number(d[1].hex)), 
      amountRequested: ethers.utils.formatEther(d[0].hex),
      returnRate: parseInt(Number(d[3].hex))/100,
      reqType: d[4],
      deadline: parseInt(Number(d[2].hex))
    })
   )

  return {
    props: {
      proposals: sortedData,
      address: '0xc6FD734790E83820e311211B6d9A682BCa4ac97b'
    }
  }
}
