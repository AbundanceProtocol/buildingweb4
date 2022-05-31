import '../styles/index.css';
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context.js'
// import { ownerAddress } from '../config'
import { button, buttonPath, Logo, LeftCorner, RightCorner, Space } from './assets'
import { useRouter } from 'next/router'
import 'easymde/dist/easymde.min.css'
import { FaPen } from 'react-icons/fa';

function App({ Component, pageProps }) {
  let targetLink = 'Vision'
  if (typeof window !== 'undefined') {
    let search = window.location.pathname
    for (let key in button) {
      if (button[key].link === search) {
        targetLink = key
      }
    }
  }
  const [account, setAccount] = useState(null)
  const [accountText, setAccountText] = useState(null)
  const router = useRouter()
  const [iconsSize, setIconsSize] = useState(30)
  const [navMenu, setNavMenu] = useState(button[targetLink].menu)
  const [menuHover, setMenuHover] = useState( {in: Date.now(), out: Date.now() } )
  const [linkTarget, setLinkTarget] = useState(targetLink)

  useEffect( () => {
    if (menuHover.in > menuHover.out) {
      let subNavBox = document.getElementsByClassName("sub-nav-box")
      subNavBox[0].style.justifyContent = "left";  
      setIconsSize(30)
    } else {
      if (typeof linkTarget !== 'object') {
        setNavMenu(button[linkTarget].menu)
      }
    }
  }, [menuHover])

  useEffect( () => {
    if (typeof linkTarget !== 'object') {
      setNavMenu(button[linkTarget].menu)
    }
  }, [linkTarget])

  const NavItem = (props) => {
    let btnHover = menuHover.in > menuHover.out
    let btn = button[props.buttonName]
    let Icon = btn.icon
    let topBox = "sub-cat-top-box flex-row pop-menu"
    let iconClass = "sub-cat-icon bg-blue size-30"
    let titleClass = "sub-cat-title nav-frame-title full-w"
    let textClass = "sub-cat-desc nav-frame-desc full-w"
    if (!btn.working) {
      topBox = "sub-cat-top-box flex-row grey-menu"
      iconClass = "sub-cat-icon bg-grey size-30"
      titleClass = "sub-cat-title nav-frame-title bg-grey full-w"
      textClass = "sub-cat-desc nav-frame-desc bg-grey full-w"
    }
    if (typeof window !== 'undefined' && window.location.pathname === btn.link) {
      topBox = "sub-cat-top-box flex-row red-menu"
      iconClass = "sub-cat-icon bg-red size-30"
      titleClass = "sub-cat-title nav-frame-title bg-red full-w"
      textClass = "sub-cat-desc nav-frame-desc bg-red full-w"
    }
    if (typeof Icon == 'undefined') { Icon = FaPen }
    let attributes = {}
    if (!btn.link) {
      attributes = {target: '_blank', rel: 'noopener noreferrer', href: btn.url}
    }
    return (
      <Link href={(btn.link && btn.working) ? btn.link : {}}>
        <a className={topBox} style={{width: btnHover ? '333px' : 'min-content', padding: btnHover ? '10px' : '3px 5px 2px 10px', margin: btnHover ? '10px' : '5px 10px', borderRadius: '15px'}} {...attributes} onClick={() => {setLinkTarget(props.buttonName)}}>
          <div className="sub-cat-box" style={{margin: btnHover ? '8px 0 8px 8px' : '0 10px 0 0', minWidth: btnHover ? '50px' : '15px'}}>
            <Icon className={iconClass} iconSize={btnHover ? '30' : '15'} style={{height: btnHover ? '30px' : '15px', width: btnHover ? '30px' : '15px'}} />
          </div>
          <div className="sub-cat-text flex-col" style={{width: btnHover ? 'auto' : 'min-content', minWidth: btnHover ? '260px' : '50px', pointerEvents: 'none'}}>
            <span className={titleClass} style={{fontSize: btnHover ?  '19px' : '15px', fontWeight: btnHover ? '800' : '600', paddingRight: '10px', pointerEvents: 'none', width: btnHover ? '100%' : 'max-content'}}>{props.buttonName}</span>
            <span className={textClass} style={{fontSize: btnHover ? '15px' : '0', opacity: btnHover ? '1' : '0', paddingRight: '10px', pointerEvents: 'none'}}>{btn.description}</span>
          </div>
        </a>
      </Link>
    );
  }

  const ConnectButton = () => {
    return (
      <div onClick={!account ? connect : disconnect}>
        <div className="size-button flex-col flex-middle">
          <div className="flex-col flex-middle">
            <div className="font-12 mar-t-6 min-width" style={{fontWeight: '700', fontSize: '15px', margin: '0', padding: '0'}}>{!account ? "connect" : accountText}</div>
          </div>
        </div>
      </div>
    );
  }

  const HomeButton = () => {
    return (
      <Link href="/">
        <a className={navMenu === "Home" ? "nav-home-button-active" : "nav-home-button"} onMouseEnter={() => {
          setNavMenu('Home')
          setMenuHover({ ...menuHover, in: Date.now() })
        }} onMouseLeave={() => {
          setMenuHover({ ...menuHover, out: Date.now() })
        }}>
          <div className="flex-row">
            <Logo />
            <div style={{ padding: '15px 15px' }}>
              <h2 className="nav-title">Abundance Protocol</h2>
              <p className="nav-subtitle">Building Web 4</p>
            </div>
          </div>
        </a>
      </Link>
    )
  }

  const TopNav = (props) => {
    let btn = button[props.buttonName]
    const TopIcon = btn.icon
    return (
      <a onMouseEnter={() => {
        setNavMenu(btn.menu)
        setMenuHover({ ...menuHover, in: Date.now() })
      }} onMouseLeave={() => { setMenuHover({ ...menuHover, out: Date.now() }) }}>
        <div className={navMenu === btn.menu ? "active-nav-link" : "nav-link"}>
          <div className="size-87 flex-col flex-middle">
            <div className="flex-col flex-middle">
              <TopIcon className="size-25" />
              <div className="font-15 mar-t-6">
                {props.buttonName}
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }

  const SubCat = () => {
    try {
      let subButtons = button['nav-menu'][navMenu]
      if (typeof subButtons == 'undefined') {
        subButtons = button['nav-menu']['Home']
      }
      return (
        subButtons.map((btn, index) => (
          <NavItem buttonName={btn} key={index} /> ))
      )
    } catch (err) {
      console.log('error:', err)
      return null;
    }
  }

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "f7b15f0b1a2d49e2b9f0e9b666842ff1"
          },
        },
      },
    })
    return web3Modal
  }

  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
      let accText = accounts[0]
      setAccountText(accText.slice(0, 5) + '...' + accText.slice(38, 42))
    } catch (err) {
      console.log('error:', err)
    }
  }

  async function disconnect() {
    setAccountText(null)
    setAccount(null)
    setTimeout(() => {
      router.push('/')
    }, 100)
  }

  return (
    <div>
      <nav className="nav-bar">
        <div className="flex-row top-nav-wrap">
          <Space />
          <div className="nav-head">
            <HomeButton />
            <Space />
            { button['top-menu'].map((btn, index) => (
              <TopNav buttonName={btn} key={index} /> ))}
            <ConnectButton />
          </div>
          <Space />
        </div>
        <div className="flex-row" style={{width: '100%', alignItems: 'flex-start' }}>
          <div className="nav-shadow" style={{width: '100%', height: '1px', backgroundColor: ''}}>
            <div className="flex-row flex-right"><RightCorner /></div>
          </div>
          <div className="nav-shadow" style={{height: 'min-content', width: 'min-content', backgroundColor: '#1D3244dd', borderRadius: '0 0 30px 30px', justifyContent: 'center'}}>
            <div className="flex-row flex-middle" style={{width: '100%', margin: '0', justifyContent: 'center'}}>
              <div className="sub-nav-box flex-row flex-wr" style={{width: 'max-content', maxWidth: '1060px', backgroundColor: '#dddddde6', borderRadius: '20px', margin: '0 10px 10px 10px'}} onMouseEnter={() => {
              setMenuHover({ ...menuHover, in: Date.now() })
              }} onMouseLeave={() => {
              setMenuHover({ ...menuHover, out: Date.now() })}}>
                <SubCat />
              </div>
            </div>
          </div>
          <div className="nav-shadow" style={{height: '1px', backgroundColor: '', width: '100%'}}>
            <div className="flex-row flex-left"><LeftCorner /></div>
          </div>
        </div>
      </nav>
      <div className="container">
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  )
}

export default App 