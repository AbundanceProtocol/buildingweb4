import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ethers } from 'ethers'
import { contractAddress } from '../config'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'
import { Warning } from './assets'

function RequestFunding() {
	const initialState = { amount: 0.0, percentReturn: 0.0, deadline: 0, reqType: 0 }
	const [request, setRequest] = useState(initialState)
	const [submitMessage, setSubmitMessage] = useState({message: '', status: 'none'})
	const { amount, percentReturn, deadline, reqType } = request
	const router = useRouter()

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

	function onChange(e) {
		setRequest( () => ({ ...request, [e.target.name]: e.target.value }) )
		if (submitMessage.status !== 'none') {
			setSubmitMessage({message: '', status: 'none'})
		}
	}

	async function saveRequestFunding() {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(contractAddress, Abundance.abi, signer)
			let _amount = ethers.utils.parseUnits(amount.toString(), 18)
			let _percentReturn = parseInt(percentReturn * 100)
			let _deadline = parseInt(deadline)
			let _reqType = parseInt(reqType)
			console.log(_amount, _percentReturn, _deadline, _reqType)
            
			try {
				// console.log(_amount)
				const val = await contract.requestFunding(_amount, _percentReturn, _deadline, _reqType)
				console.log(val)
				const blockHash = await provider.waitForTransaction(val.hash)

				setSubmitMessage({message: blockHash.transactionHash, status: 'success'})
				setRequest({ amount: 0, percentReturn: 0, deadline: 0, reqType: 0 })

				// console.log(submitMessage)
			} catch (err) {
				console.log('Error: ', err)
				setSubmitMessage({message: '', status: 'failed'})
				// console.log(submitMessage)
			}
		}    
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

	async function requestFunding() {
			// if (!amount || !percentReturn || !deadline || !reqType) return
			// const hash = await savePostToIpfs()
		await saveRequestFunding()
			// router.push('/')
	}

	function fundingToggle(e) {
		console.log(e.target.name)
		if (e.target.name === 'request') {
			setRequest( () => ({ ...request, reqType: 1, deadline: 0 }) )
		} else if (e.target.name === 'auction') {
			setRequest( () => ({ ...request, reqType: 0 }) )
		}
	}

	return (
    <div style={{padding: '150px 0 0 0'}}>
      <Warning />
      <div className="input-container flex-middle flex-col">
        { (submitMessage.status !== 'none') && <RequestMessage /> }
        <div className="flex-row" style={{padding: '0 0 10px 0', width: '100%'}}>
          <span className='container-title'>Funding</span>
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
	)
}

export default RequestFunding