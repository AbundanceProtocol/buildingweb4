
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Roadmap(props) {
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
              <p className="top-font">Roadmap</p>
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
  
  // const data = await contract.getFundingReq('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 0)
  // const data = await contract.numReturn()
  // console.log(data)
  // let stringData = JSON.parse(JSON.stringify(data)).hex
  return {
    props: {
      posts: ''
    }
  }
}
