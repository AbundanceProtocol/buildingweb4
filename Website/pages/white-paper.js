
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import { FaAngleRight } from 'react-icons/fa'
// import { Viewer } from '@react-pdf-viewer/core'
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
// import '@react-pdf-viewer/core/lib/styles/index.css'
// import '@react-pdf-viewer/default-layout/lib/styles/index.css'
// import { Worker } from '@react-pdf-viewer/core'
// import pdfFile from './assets/Web4-White-Paper.pdf'

import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Whitepaper(props) {
  const { posts } = props
  // const [defaultPdfFile] = useState(pdfFile)
  const account = useContext(AccountContext)
  // const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }

  return (
    <div>
      <div className="top-frame">
        <div className="border-style no-border">
            <p className="top-font">Abundance Protocol Whitepaper</p>
        </div>
      </div>




      {/* <div className="top-frame flex-middle">
        <div className="border-style wrap bg-grd6 flex-middle flex-row">
          {
            defaultPdfFile && <>
              <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.13.216'>
                <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </>
          }
        </div>
      </div> */}
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

