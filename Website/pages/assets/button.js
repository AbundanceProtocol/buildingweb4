import { FaSearch, FaCode, FaUser, FaLightbulb, FaKey, FaLockOpen, FaGlobe, FaPen, FaCoins, FaLink, FaAddressCard, FaWallet, FaAward, FaQuestionCircle, FaMap, FaCogs, FaFileAlt, FaGithub, FaMediumM, FaYoutube, FaTwitter, FaAt, FaDiscord, FaFolderOpen, FaTasks, FaScroll, FaSearchDollar } from 'react-icons/fa';
import OpenSeaIcon from './OpenSeaIcon';
import { GiTwoCoins, GiReceiveMoney } from 'react-icons/gi'
import { BsBarChartFill, BsFillDiagram3Fill } from 'react-icons/bs'
import { MdCastConnected, MdNotifications, MdFavorite, MdFilterFrames, MdMail, MdWork } from 'react-icons/md'
import { RiTeamFill } from 'react-icons/ri'
import { HiBadgeCheck } from 'react-icons/hi'
import { IoReader } from 'react-icons/io5'

const button = {
    'top-menu': ['portal', 'create', 'fund', 'explore', 'connect'],
    'nav-menu': {
        'Home': ['Vision', 'Roadmap', 'Mechanism', 'Whitepaper', 'FAQ', 'Blog'],
        'Portal': ['Profile', 'Wallet', 'Expertise', 'Portfolio', 'Subscriptions', 'Inbox'],
        'Fund': ['Project Funding', 'Review Funding', 'Funding Proposal', 'Search Requests'],
        'Create': ['Project', 'Post', 'Initial Review', 'Collaboration', 'Reviews'],
        'Search': ['Posts', 'Users', 'Proposals', 'Categories'],
        'Connect': ['GitHub', 'Discord', 'OpenSea', 'YouTube', 'Twitter', 'Email'],
        'Eco': ['Trending', 'Curated', 'Favorites', 'Feed'],
    },
    'GitHub': {
        link: false,
        url: 'https://github.com/buildingweb4/buildingweb4',
        menu: 'Connect',
        description: 'Help us develop the protocol on GitHub',
        account: false,
        working: true,
        icon: FaGithub
    },
    'Discord': {
        link: false,
        url: 'https://discord.com/invite/sHcV7g3nqu',
        menu: 'Connect',
        description: 'Join our Discord community',
        account: false,
        working: true,
        icon: FaDiscord
    },
    'OpenSea': {
        link: false,
        url: 'https://opensea.io/web4',
        menu: 'Connect',
        description: "Get our project's NFTs",
        account: false,
        working: true,
        icon: OpenSeaIcon
    },
    'Blog': {
        link: false,
        url: 'https://buildingweb4.medium.com/',
        menu: 'Home',
        description: 'Read our articles on Medium',
        account: false,
        working: true,
        icon: IoReader
    },
    'YouTube': {
        link: false,
        url: 'https://www.youtube.com/c/BuildingWeb4',
        menu: 'Connect',
        description: 'Subscribe to our channel',
        account: false,
        working: true,
        icon: FaYoutube
    },
    'Twitter': {
        link: false,
        url: 'https://twitter.com/BuildingWeb4',
        menu: 'Connect',
        description: 'Follow us on Twitter',
        account: false,
        working: true,
        icon: FaTwitter
    },
    'Email': {
        link: false,
        url: '',
        menu: 'Connect',
        description: 'Contact us',
        account: false,
        working: false,
        icon: FaAt
    },

    'create': {
        link: '/trending',
        menu: 'Create',
        account: false,
        working: true,
        icon: FaPen
    },
    'fund': {
        link: '/trending',
        menu: 'Fund',
        account: false,
        working: true,
        icon: FaCoins
    },
    'connect': {
        link: '/trending',
        menu: 'Connect',
        account: false,
        working: true,
        icon: FaLink
    },
    'explore': {
        link: '/trending',
        menu: 'Eco',
        account: false,
        working: true,
        icon: FaGlobe
    },
    'portal': {
        link: '/profile',
        menu: 'Portal',
        description: 'review categories',
        account: false,
        working: true,
        icon: FaUser
    },
    'search': {
        link: '/posts',
        menu: 'Search',
        description: 'review categories',
        account: false,
        working: false,
        icon: FaSearch
    },

    'Trending': {
        link: '/trending',
        menu: 'Eco',
        description: 'Trending projects and posts',
        account: false,
        working: false,
        icon: BsBarChartFill
    },
    'Curated': {
        link: '/curated',
        menu: 'Eco',
        description: 'Curated project and posts',
        account: false,
        working: false,
        icon: MdFilterFrames
    },
    'Favorites': {
        link: '/favorites',
        menu: 'Eco',
        description: 'Your favorite project categories',
        account: true,
        working: false,
        icon: MdFavorite
    },
    'Feed': {
        link: '/feed',
        menu: 'Eco',
        description: 'Latest projects and posts',
        account: true,
        working: false,
        icon: FaScroll
    },
    'Vision': {
        link: '/',
        menu: 'Home',
        description: 'The Abundance Protocol vision for a decentralized economy',
        account: false,
        working: true,
        icon: FaLightbulb
    },
    'FAQ': {
        link: '/faq',
        menu: 'Home',
        description: 'Frequently asked questions',
        account: false,
        working: false,
        icon: FaQuestionCircle
    },
    'Mechanism': {
        link: '/mechanism',
        menu: 'Home',
        description: 'How it all works',
        account: false,
        working: false,
        icon: FaCogs
    },

    'Review Funding': {
        link: '/funding',
        menu: 'Fund',
        description: 'Request or auction funding for reviews',
        account: true,
        working: true,
        icon: GiReceiveMoney
    },
    'Funding Proposal': {
        link: '/proposal',
        menu: 'Fund',
        description: 'Create an ecosystem improvement proposal',
        account: true,
        working: false,
        icon: FaGlobe
    },

    'Profile': {
        link: '/profile',
        menu: 'Portal',
        description: 'Update your PFP and bio',
        account: false,
        working: false,
        icon: FaAddressCard
    },
    'Wallet': {
        link: '/profile',
        menu: 'Portal',
        description: 'Manage your funds, investments, proposals & bids',
        account: false,
        working: false,
        icon: FaWallet
    },
    'Expertise': {
        link: '/profile',
        menu: 'Portal',
        description: 'Review your scores across fields',
        account: false,
        working: false,
        icon: FaAward
    },
    'Portfolio': {
        link: '/portfolio',
        menu: 'Portal',
        description: 'Check your projects, posts and reviews',
        account: false,
        working: false,
        icon: FaFolderOpen
    },
    'Subscriptions': {
        link: '/subscriptions',
        menu: 'Portal',
        description: 'Subscribe to Categories to participate in reviews',
        account: false,
        working: false,
        icon: MdCastConnected
    },
    'Inbox': {
        link: '/inbox',
        menu: 'Portal',
        description: 'Pending reviews',
        account: false,
        working: false,
        icon: MdMail
    },

    'Project Funding': {
        link: '/project-funding',
        menu: 'Fund',
        description: 'Request funding for a public goods project',
        account: true,
        working: false,
        icon: GiTwoCoins
    },
    'Roadmap': {
        link: '/roadmap',
        menu: 'Home',
        description: "The Protocol's Master Plan",
        account: false,
        working: false,
        icon: FaMap
    },
    'Reviews': {
        link: '/reviews',
        menu: 'Create',
        description: 'Pending reviews',
        account: true,
        working: false,
        icon: FaTasks
    },
    'Whitepaper': {
        link: '/white-paper',
        menu: 'Home',
        description: 'In-depth explanation of the Protocol',
        account: false,
        working: false,
        icon: FaFileAlt
    },
    'Project': {
        link: '/create-project',
        menu: 'Create',
        description: 'Create a project',
        account: true,
        working: false,
        icon: MdWork
    },
    'Post': {
        link: '/create-post',
        menu: 'Create',
        description: 'Create a post',
        account: true,
        working: true,
        icon: FaPen
    },
    'Collaboration': {
        link: '/collaboration',
        menu: 'Create',
        description: 'Create a collaboration',
        account: true,
        working: false,
        icon: RiTeamFill
    },
    'Initial Review': {
        link: '/init-review',
        menu: 'Create',
        description: 'Create an initial review',
        account: true,
        working: false,
        icon: HiBadgeCheck
    },

    'inbox': {
        link: '/inbox',
        menu: 'Create',
        description: 'review categories',
        account: true,
        working: false,
    },
    'Posts': {
        link: '/posts',
        menu: 'Search',
        description: 'review categories',
        account: false,
        working: false,
        icon: FaPen
    },
    'Users': {
        link: '/users',
        menu: 'Search',
        description: 'review categories',
        account: false,
        working: false,
        icon: FaPen
    },
    'Search Requests': {
        link: '/proposals',
        menu: 'Fund',
        description: 'Find funding requests and auctions',
        account: false,
        working: true,
        icon: FaSearchDollar
    },
    'Categories': {
        link: '/categories',
        menu: 'Search',
        description: 'review categories',
        account: false,
        working: false,
        icon: BsFillDiagram3Fill
    },
  }

  export default button;