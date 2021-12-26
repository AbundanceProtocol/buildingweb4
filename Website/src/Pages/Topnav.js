import React, { TouchEvent } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../bw4-logo.svg';
import { FaGithub, FaSearch, FaPencilAlt, FaUserAlt, FaListUl, FaComments, FaYoutube, FaTwitter, FaDiscord, FaMediumM } from 'react-icons/fa';
import { ImFileText2 } from 'react-icons/im';
import { AiOutlineHome } from 'react-icons/ai';
import { VscTasklist, VscKey } from 'react-icons/vsc';
import { RiFileList3Line } from 'react-icons/ri';
import { MdAlternateEmail } from 'react-icons/md';
import { GiGearHammer } from 'react-icons/gi';
import { BsQuestionCircle, BsMap } from 'react-icons/bs';
import '../index.css';
import { dragEnd, dragStart } from '../interact.config'

const Topnav = () => {
  return (
    <div className="top-nav">
      <div className="nav-container">
        <div className="draggable platform-menu" onTouchEnd={ dragEnd } onTouchStart={ dragStart } onMouseDown={ dragStart } onMouseUp={ dragEnd } >
          <div className="flex-row flex-middle">
            <NavLogo />
            <Link to="/" className="no-under">
                <HeaderIcon iconType="home" />
            </Link>
            <Link to="/roadmap" className="no-under">
                <HeaderIcon iconType="roadmap" />
            </Link>
            <Link to="/how-it-works" className="no-under">
                <HeaderIcon iconType="how it works" />
            </Link>
            <Link to="/white-paper" className="no-under">
                <HeaderIcon iconType="whitepaper" />
            </Link>
            <Link to="/faq" className="no-under">
                <HeaderIcon iconType="faq" />
            </Link>
            <Link to="/connect" className="no-under">
                <HeaderIcon iconType="connect" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const NavLogo = () => {
  return (
    <div className="flex-col flex-middle">
      <div className="size-87 flex-row flex-middle">
        <img src={Logo} className="size-50" alt="logo" />
        <div className="flex-col col-ccc font-20" style={{margin: '0 0 0 10px'}}>
          <div>Building Web 4.0</div>
        </div>
      </div>
    </div>
  );
}

const icons = {
  'home': AiOutlineHome, 'roadmap': BsMap, 'how it works': GiGearHammer, 'whitepaper': RiFileList3Line, 'faq': BsQuestionCircle, 'connect': VscKey, 'search': FaSearch, 'github': FaGithub, 'youtube': FaYoutube, 'twitter': FaTwitter, 'discord': FaDiscord, 'medium': FaMediumM, 'post': ImFileText2, 'create': FaPencilAlt, 'user': FaUserAlt, 'email': MdAlternateEmail, 'comments': FaComments, 'summary': VscTasklist, 'categories': FaListUl
};

function Icon(props) {
  const HeaderIcon = icons[props.iconType];
  return <HeaderIcon className="size-25 col-ccc" />
}

const HeaderIcon = (props) => {
  return (
    <div className="size-87 flex-col flex-middle">
      <div className="flex-col flex-middle">
        <Icon iconType={props.iconType} className="size-25 col-ccc" />
        <div className="col-ccc font-15 mar-t-6">{props.iconType}</div>
      </div>
    </div>
  );
}

export default Topnav;