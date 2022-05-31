import { useContext, useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { ExpandIcon, ScienceIcon, CollabIcon, KnowledgeIcon, LogoHD, OpenSeaIcon, PublicGoodsIcon, CodeIcon } from './assets'
import ReactPlayer from "react-player"
import Link from 'next/link'
import { AccountContext } from '../context'
import { contractAddress, ownerAddress } from '../config'
import { FaBalanceScale, FaCheckCircle, FaChartLine, FaHandHoldingUsd, FaMoneyBillAlt, FaGithub, FaMediumM, FaYoutube, FaTwitter, FaAt, FaDiscord, FaUsers, FaListAlt, FaCode } from 'react-icons/fa';
import { MdScience } from 'react-icons/md'
import Abundance from '../artifacts/contracts/Abundance.sol/Abundance.json'

export default function Home(props) {
  const ref = useRef(null)
  const [vidSize, setVidSize] = useState({w: 1220 + 'px', h: 1220/16*9 + 'px'})
  const { posts } = props
  const account = useContext(AccountContext)
  const [viewToggle, setViewToggle] = useState({record: false, source: false, media: false, science: false})
  const router = useRouter()
  useLayoutEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  function handleResize() {
    setVidSize({w: ref.current.offsetWidth + 'px', h: ref.current.offsetWidth/16*9 + 'px'})
  }

  function toggleViews(e) {
    let targetView = e.target.dataset.name
    setViewToggle({ ...viewToggle, [targetView]: !viewToggle[targetView] })
  }

  return (
    <div style={{padding: '130px 0 0 0' , backgroundColor: '#bfdeff'}}>
      <div className="top-frame flex-middle">
        <div className="border-style wrap bg-grd6 flex-middle flex-row flex-wr" ref={ref}>
          <div className='flex-col flex-2'>
            <p className="large-font">Powering the Abundance Economy</p>
            <p className="mid-font">Building the decentralized economy for digital content and public goods</p>
          </div>
          <div style={{padding: '0 20px 0 0'}}>
            <LogoHD />
          </div>
        </div>
      </div>

      <div className="top-frame flex-middle flex-row flex-wr">
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <ExpandIcon />
          <p className="frame-title">Expanding the Scope of the Economy</p>
          <p className="frame-desc">The Abundance Protocol strives to expand the scope of the economy, so that everyone can make a living by making meaningful contributions to society - even when these contributions are not properly valued within the market economy.</p>
        </div>
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <CollabIcon />
          <p className="frame-title">Rewarding Collaboration & Creativity</p>
          <p className="frame-desc">In the market economy, you get no benefit from others using your ideas without your permission - so you need to put extra effort into protecting your intellectual property.</p>
          <p className="frame-desc">The abundance economy allows permissionless use of intellectual property, while rewarding original creators for every derivative work - thus promoting collaboration and free flow of ideas.</p>
        </div>
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <PublicGoodsIcon />
          <p className="frame-title">Investing in Public Goods</p>
          <p className="frame-desc">The protocol is effective at capturing the value of public goods, it also allows users to request funding for creating public goods project, in exchange for a share of the project&apos;s returns - thus creating a self-sustaining economy for public goods.</p>
        </div>


        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <CodeIcon />
          <p className="frame-title">Open Source Revolution</p>
          <p className="frame-desc">Our vision is to allow any developer to work on any open source project and be rewarded according to their contribution.</p>
          <p className="frame-desc">By incentivizing quality and collaboration we will be able to create a rich and deeply integrated open source ecosystem like we&apos;ve never seen before.</p>
        </div>
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <ScienceIcon />
          <p className="frame-title">Scientific Renaissance</p>
          <p className="frame-desc">The Abundance Protocol creates a mechanism for people to invest in scientific research, in return for a share of the impact the research makes.</p>
          <p className="frame-desc">This novel economic paradigm may lead to the next breakthroughs in cancer research or fundamental physics.</p>
        </div>
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-3">
          <KnowledgeIcon />
          <p className="frame-title">Mapping Humanity&apos;s Knowledge</p>
          <p className="frame-desc">The Abundance Protocol makes it easy for anyone to see the credibility and relatedness of digital information.</p>
          <p className="frame-desc">
          Thus, as projects are reviewed, the protocol produces an ever-growing network of humanity&apos;s knowledge.</p>
        </div>
      </div>

      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col">
          <p className="frame-title">&nbsp;</p>
        </div>
      </div>

      <div className="top-frame flex-middle">
        <div className="border-style wrap-title flex-middle flex-col">
            <p className="title-font">What is the Abundance Protocol</p>
        </div>
      </div>
      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h">
          <p className="frame-desc-20">The Abundance Protocol is a decentralized, blockchain-powered digital economy that works based on a Proof-of-Value mechanism.
          </p>
          <p className="frame-desc-20">
          It values any digital content (open-source projects, articles, videos, social media posts, etc.) based on the credibility and relative importance of the content, thus creating a viable economic model for public goods.</p>
          </div>
      </div>
      <div className="top-frame flex-middle">
        <ReactPlayer url="https://youtu.be/CTu9kMtb6vA" width={vidSize.w} height={vidSize.h} className="react-player" />
      </div>

      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col">
          <p className="frame-title">&nbsp;</p>
        </div>
      </div>

      <div className="top-frame flex-middle">
        <div className="border-style wrap-title flex-middle flex-col">
            <p className="title-font">Transforming the Intenet (and the Economy)</p>
        </div>
      </div>
      <div className="top-frame flex-middle flex-row">
        <div className="border-style no-border wrap-cln flex-middle flex-col flex-1 min-h">
          <p className="frame-desc-20">The Abundance Protocol has far-reaching implications in the digital space; it opens the door to incredible progress and innovation in content creation, and may serve as a powerful engine of growth for the broader economy.
          </p>
        </div>
      </div>
      <div className="top-frame flex-middle flex-row flex-wr">
        <div className="border-style no-border wrap-clr flex-middle flex-col flex-1 min-h flex-2">
          <FaUsers className="icon-40" />
          <p className="frame-title">Social Media</p>
          <p className="frame-desc">In the current ratings-based social media environment the most extreme, controversial, polarizing and outrageous posts tend to grab the most attention, and therefore dominate the conversation. The protocol offers an alternative paradigm that promotes civil discourse and truthfulness.
          { (viewToggle.media) &&
            (<p className="frame-desc">
            Instead of focusing on getting the most &apos;likes&apos; people will consider what they can contribute to the conversation. The protocol would also reduce the spread of misinformation on social media – without the need for social media platforms to censor or suspend anyone; misleading posts would simply get a low credibility score, while online trolls and bots would have little to no influence in the protocol due to their low (or negative) content scores</p>)
          }
          <span onClick={toggleViews} data-name="media" style={{fontWeight: '700'}}> ({viewToggle.media ? "show less" : "read more"})</span></p> 
        </div>
        <div className="border-style no-border wrap-clr flex-middle flex-col flex-1 min-h flex-2">
          <FaListAlt className="icon-40" />
          <p className="frame-title">Track Record</p>
          <p className="frame-desc">One of the built-in features of the Abundance Protocol is the ability to see the track record of posts an author makes (either related to a particular post, topic, or overall). This feature allows people to more easily determine the reliability of analysts and commentators who make predictions in fields such as finance, politics, sports and so on. 
          { (viewToggle.record) && (
            <p className="frame-desc">
            Seeing the track record of financial analysts, for example, will allow individuals to make better decisions with their investments, while at the same time bring more transparency and accountability to the field.</p>
          )
          }
          <span onClick={toggleViews} data-name="record" style={{fontWeight: '700'}}> ({viewToggle.record ? "show less" : "read more"})</span></p> 
        </div>

        <div className="border-style no-border wrap-clr flex-middle flex-col flex-1 min-h flex-2">
          <FaCode className="icon-40" />
          <p className="frame-title">Open Source</p>
          <p className="frame-desc">There is currently no viable business model for developers to make money directly off of their open-source projects. Certainly, there are ways for developers to make money around the open-source project (paid support, Open Core, selling additional features, and so on), but none of these are based on developers profiting from the open-source project directly. 
          { (viewToggle.source) && (
            <>
              <p className="frame-desc">
              Protocol developers can directly profit from their open-source project by giving the project an Importance Score and Credibility Score. When other users utilize the open-source code the project gets a portion (Influence Credit) of the other users&apos; content, thus increasing the project&apos;s content score.</p>
              <p className="frame-desc">
              This business model makes it easy for users to collaborate on open-source projects, as well as build on other users&apos; open-source projects. The protocol therefore makes it possible for every developer to profits in direct proportion to their contribution, while everyone gets access to high-quality freeware.</p>
            </>
          )
          }
          <span onClick={toggleViews} data-name="source" style={{fontWeight: '700'}}> ({viewToggle.source ? "show less" : "read more"})</span></p> 
        </div>
        <div className="border-style no-border wrap-clr flex-middle flex-col flex-1 min-h flex-2">
          <MdScience className="icon-40" />
          <p className="frame-title">Scientific Research</p>
          <p className="frame-desc">The Abundance protocol offers an alternative to government grants and paywalled scientific journals in scientific research. It allows scientists to directly profit from their research (based on its accuracy and importance to the public), and receive funding from other users through the protocol&apos;s investment mechanism.
          { (viewToggle.science) && (
            <p className="frame-desc">
            The protocol would allow scientists to maintain intellectual independence in their research, allow researchers (and the wider public) to quickly evaluate the quality and reliability of articles in any field, and give the public full access to scientific articles – thus making significant improvements in how scientific research is done and disseminated.</p>
          )
          }
          <span onClick={toggleViews} data-name="science" style={{fontWeight: '700'}}> ({viewToggle.science ? "show less" : "read more"})</span></p> 
        </div>
      </div>

      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col">
          <p className="frame-title">&nbsp;</p>
        </div>
      </div>
      <div className="top-frame flex-middle">
        <div className="border-style wrap-title flex-middle flex-col">
            <p className="title-font">Get Involved</p>
        </div>
      </div>
      <div className="top-frame flex-middle flex-row flex-wr">
        <a href="https://github.com/buildingweb4/buildingweb4" className="border-style wrap bg-grd6 flex-middle flex-col flex-1 min-h flex-3" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon-40" />
          <p className="frame-title">GitHub</p>
          <p className="frame-desc text-c">Help us develop the protocol on GitHub</p>
        </a>
        <a href="https://discord.com/invite/sHcV7g3nqu" className="border-style wrap bg-grd6 flex-middle flex-col flex-1 min-h flex-3" target="_blank" rel="noopener noreferrer">
          <FaDiscord className="icon-40" />
          <p className="frame-title">Discord</p>
          <p className="frame-desc text-c">Join our Discord Community</p>
        </a>
        <a href="https://opensea.io/web4" className="border-style wrap bg-grd6 flex-middle flex-col flex-1 min-h flex-3" target="_blank" rel="noopener noreferrer">
          <OpenSeaIcon iconSize='40' className="icon-40" />
          <p className="frame-title">OpenSea</p>
          <p className="frame-desc text-c">Get our project&apos;s NFTs</p>
        </a>
      </div>
      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col">
          <p className="frame-title">&nbsp;</p>
        </div>
      </div>
      <div className="top-frame flex-middle">
        <div className="border-style wrap-title flex-middle flex-col">
            <p className="title-font">Project Links</p>
        </div>
      </div>
      <div className="top-frame flex-middle flex-row flex-wr">
        <a href="https://buildingweb4.medium.com/" className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-4" target="_blank" rel="noopener noreferrer">
          <FaMediumM className="icon-40" />
          <p className="frame-title">Medium</p>
          <p className="frame-desc text-c">Read our articles</p>
        </a>
        <a href="https://www.youtube.com/c/BuildingWeb4" className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-4" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="icon-40" />
          <p className="frame-title">YouTube</p>
          <p className="frame-desc text-c">Subscribe to our channel</p>
        </a>
        <a href="https://twitter.com/BuildingWeb4" className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-4" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon-40" />
          <p className="frame-title">Twitter</p>
          <p className="frame-desc text-c">Follow us on Twitter</p>
        </a>
        <div className="border-style wrap-cln flex-middle flex-col flex-1 min-h flex-4">
          <FaAt className="icon-40" />
          <p className="frame-title">Email</p>
          <p className="frame-desc text-c">Contact us</p>
        </div>
      </div>

      <div className="top-frame flex-middle flex-row">
        <div className="border-style wrap-cln flex-middle flex-col">
          <p className="frame-title">&nbsp;</p>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  try {
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
    // const time = await contract.progress()
    // console.log(time)
    // let stringData = JSON.parse(JSON.stringify(data)).hex
    return {
      props: {
        posts: ''
      }
    }
  } catch (err) {
    console.log('error:', err)
    return { props: { posts: null } }  
  }
}