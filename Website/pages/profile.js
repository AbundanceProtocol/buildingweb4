
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Profile(props) {
  const { posts } = props
  const initialState = { amount: 0.0, percentReturn: 0.0, deadline: 0, reqType: 0 }
	const [request, setRequest] = useState(initialState)
  const account = useContext(AccountContext)
	const [submitMessage, setSubmitMessage] = useState({message: '', status: 'none'})
	const { amount, percentReturn, deadline, reqType } = request

  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }

	function onChange(e) {
		setRequest( () => ({ ...request, [e.target.name]: e.target.value }) )
		if (submitMessage.status !== 'none') {
			setSubmitMessage({message: '', status: 'none'})
		}
	}

	function fundingToggle(e) {
		console.log(e.target.name)
		if (e.target.name === 'request') {
			setRequest( () => ({ ...request, reqType: 1, deadline: 0 }) )
		} else if (e.target.name === 'auction') {
			setRequest( () => ({ ...request, reqType: 0 }) )
		}
	}

	const RequestMessage = () => {
		return (
			<>
				{ (submitMessage.status === 'success') && (
					<div className="alert-button flex-col alert-success">
						<span className="alert-text">Funding request submitted successfully!</span>
						<span className="alert-text">Transaction hash:</span>
						<span className="alert-text-tx">{submitMessage.message}</span>
					</div>)
				}
				{ (submitMessage.status === 'failed') && (
					<div className="alert-button alert-fail">
						<p className="alert-text">Funding request failed</p>
					</div>)
				}
			</>
		)
	}

	const RequestFunds = () => {
		if (((reqType == 0 && deadline > 0 && deadline <= 90) || (reqType == 1 && deadline == 0)) && (percentReturn > 0 && percentReturn < 100) && (amount > 0)) {
			return (
				<button className="input-button" type='button' onClick={requestFunding}>Request Funding</button>
			)
		} else {
			return (
				<button className="input-button-off" type='button' disabled>Request Funding</button>
			)
		}
	}



  return (
    <div>
      <div className="top-frame flex-row">
        <div className="nav-box" style={{margin: '30px 20px'}}>
          <input type="button" name='self-review' value="Profile" className="nav-button-top toggle-on" />
          <input type="button" name='self-review' value="Wallet" className="nav-button toggle-off" />
          <input type="button" name='self-review' value="Expertise" className="nav-button-bottom toggle-off" />

          <input type="button" name='self-review' value="Post" className="nav-button-top toggle-off" />
          <input type="button" name='self-review' value="Initiate Review" className="nav-button toggle-off" />
          <input type="button" name='self-review' value="Fund Project" className="nav-button toggle-off" />
          <input type="button" name='self-review' value="Request Funding" className="nav-button toggle-off" />
          <input type="button" name='self-review' value="Review" className="nav-button toggle-off" />
          <input type="button" name='self-review' value="Request" className="nav-button-bottom toggle-off" />

          <input type="button" name='self-review' value="Feed" className="nav-button-top toggle-off" />
          <input type="button" name='self-review' value="Subscriptions" className="nav-button-bottom toggle-off" />
        </div>
        





<div className="input-container flex-middle flex-col full-w" style={{margin: '30px 0px'}}>
			{ (submitMessage.status !== 'none') && <RequestMessage /> }
			<div className="flex-row" style={{padding: '0 0 10px 0', width: '100%'}}>
				<span className='container-title'>Profile</span>
				<div className="flex-row">
					<input type="button" onClick={fundingToggle} name='request' value="Request" className={reqType === 1 ? "input-toggle-button-l toggle-on" : "input-toggle-button-l toggle-off"} />
					<input type="button" onClick={fundingToggle} name='auction' value="Auction" className={reqType === 0 ? "input-toggle-button-r toggle-on" : "input-toggle-button-r toggle-off"} />
				</div>
			</div>
			<div className="inner-container">
				<span className='input-desc'>Amount requested</span>
				<div className="flex-row">
					<input type="number" min="0" onChange={onChange} name='amount' placeholder='0.0' step='0.1' value={request.amount} className="input-field-left" />
					<input type="number" placeholder='WEB' className="input-field-right" disabled />
				</div>
			</div>
			<div className="inner-container">
				<span className='input-desc'>{(reqType === 0) ? "Max r" : "R"}eturn offered</span>
				<div className="flex-row">
					<input type="number" min="0" onChange={onChange} name='percentReturn' placeholder='5.0' step="0.1" value={request.percentReturn} className="input-field-left" />
					<input type="number" placeholder='%' className="input-field-right" disabled />
				</div>
			</div>
			{
				(reqType === 0) && (
					<div className="inner-container">
						<span className='input-desc'>Deadline</span>
						<div className="flex-row">
							<input type="number" min="0" max="90" onChange={onChange} name='deadline' placeholder='21' value={request.deadline} className="input-field-left" />
							<input type="number" placeholder='days' className="input-field-right" disabled />
						</div>
					</div>
				)
			}
			<RequestFunds />
		</div>






        
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
  // const data = await contract.numReturn()

  // let stringData = JSON.parse(JSON.stringify(data)).hex
  return {
    props: {
      posts: ''
    }
  }
}
