
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Inbox(props) {
  const { posts } = props
  const account = useContext(AccountContext)

  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }

  return (
    <div>
      <div className="top-frame">
        {
          <div className="border-style">
              <p className="top-font">Inbox</p>
          </div>
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
  // const data = await contract.numReturn()

  // let stringData = JSON.parse(JSON.stringify(data)).hex
  return {
    props: {
      posts: ''
    }
  }
}

