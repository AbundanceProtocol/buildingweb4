import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { AccountContext } from '../context.js'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { contractAddress } from '../config'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { Warning } from './assets'

const client = create('https://ipfs.infura.io:5001/api/v0')
const SimpleMDE = dynamic( () => import('react-simplemde-editor'), { ssr: false } )

function CreatePost() {
	let authorAddress = AccountContext._currentValue
	if (!authorAddress) {authorAddress = ''}
	const [editAuthor, setEditAuthor] = useState(false)
	const [reviewToggle, setReviewToggle] = useState(false)
	const [authorList, setAuthorList] = useState([authorAddress])
	const initialState = { title: '', content: '', author: authorAddress }
	const [post, setPost] = useState(initialState)
	const { title, content, author } = post
	const router = useRouter()
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);


	function onChange(e) {
		setPost( () => ({ ...post, [e.target.name]: e.target.value }) )
	}

	async function savePostToIpfs() {
		try {
			const added = await client.add(JSON.stringify(post))
			return added.path
		} catch (err) {
			console.log('error: ', err)
		}
	}

	async function savePost(hash) {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(contractAddress, Abundance.abi, signer)
			console.log('contract: ', contract)
			try {
				const val = await contract.fetchCategory(hash)
				console.log(val)
				console.log('val: ', val)
			} catch (err) {
				console.log('Error: ', err)
			}
		}    
	}

	async function createPost(_title, _hash, _authors) {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(contractAddress, Abundance.abi, signer)
			console.log('contract: ', contract)
			try {
				const val = await contract.createPost(_title, _hash, _authors)
				console.log(val)
				// await provider.waitForTransaction(val.hash)
				console.log('val: ', val)
			} catch (err) {
				console.log('Error: ', err)
			}
		}    
	}

	async function createNewPost() {
		if (!title || !content) return
		const hash = await savePostToIpfs()
		await savePost(hash)
		router.push('/')
	}
  
	function removeAuthor(e) {
		let authorName = e.target.dataset.author
		let tempList = authorList
		for (let i = 0; i < tempList.length; i++) {
			if (tempList[i] === authorName) {
				tempList.splice(i, 1)
				i--
			}
		}
		setAuthorList(tempList)
		forceUpdate()
	}

	function changeAuthor() {
		if (editAuthor) {
			setEditAuthor(false)
		} else if (!editAuthor) {
			setEditAuthor(true)
		}
	}

	function addAuthor() {
		if(authorList.indexOf(author) == -1) {
			setAuthorList(authorList => [...authorList, author]);
		}
	}

	function shortenName(longName) {
		if (longName) {
			let shortName = (longName.slice(0, 5) + '...' + longName.slice(38, 42))
			return shortName
		}
		return null
	}

	const SubmitPost = () => {
		if (title && content && authorList.length > 0 ) {
			return (
				<button className="input-button" type='button' onClick={createNewPost}>Submit Post</button>
			)
		} else {
			return (
				<button className="input-button-off" type='button' disabled>Submit Post</button>
			)
		}
	}

	const AuthorsList = (props) => {
		let authors = props.authors
		return (
			authors.map((authorName, index) => (
				<AuthorName authName={authorName} key={index} />
			))
		)
	}

	const AuthorName = (props) => {
		let auth = props.authName
		return (
			<div className="input-toggle-button-small author-box flex-row">
				<span style={{padding: '0 6px 0 0'}}>{shortenName(auth)}</span>
				{ (editAuthor) && (
				<div onClick={removeAuthor} data-author={auth}><FaTimesCircle className="times-button" /></div>	)}
			</div>
		)
	}

	function selfReviewToggle(e) {
		if (reviewToggle) {
			setReviewToggle(false)
		} else if (!reviewToggle) {
			setReviewToggle(true)
		}
	}

	return (
    <div style={{padding: '150px 0 0 0'}}>
      <Warning />
      <div className="input-container-wide flex-middle flex-col">
        <div className="flex-row" style={{padding: '0 0 10px 0', width: '100%'}}>
          <span className='container-title'>Create Post</span>
          <div className="flex-row">
            <input type="button" onClick={selfReviewToggle} name='self-review' value="Self-Review" className={reviewToggle ? "input-toggle-button toggle-off" : "input-toggle-button toggle-on"} />
          </div>
        </div>

        <div className="inner-container">
          <span className='input-desc'>Post title</span>
          <input onChange={onChange} name='title' placeholder='Post title' value={post.title} className="input-field" />
        </div>
        <div className="inner-container">
          <div className="flex-row" style={{width: '100%'}}>
            <div className='flex-row author-wrap'>
              <span className='input-desc self-al'>Author(s):</span>
              <AuthorsList authors={authorList} />
            </div>
            <input type="button" onClick={changeAuthor} name='author' value={editAuthor ? 'Close' : 'Edit'} className="input-toggle-button-small toggle-on" />
          </div>
          { (editAuthor) && (
            <div className="flex-row">
              <input onChange={onChange} name='author' placeholder='Author' value={post.author} className="input-field-left" style={{borderRight: '0'}} />
              <div className='input-field-right check-button-box'>
                <FaCheckCircle className="check-button" onClick={addAuthor} />
              </div>
            </div>
            )
          }
        </div>
        <div className="inner-container">
          <span className='input-desc'>Post content</span>
          <SimpleMDE className="input-field stretch-field" placeholder="Post text" value={post.content} onChange={value => setPost({ ...post, content: value })} />
        </div>
        <SubmitPost />
      </div>
          
    </div>
	)
}

export default CreatePost

CreatePost.provider = AccountContext