import React from 'react';
// import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Logo from './bw4-logo.svg';
// import { FaGithub, FaSearch, FaPencilAlt, FaUserAlt, FaListUl, FaComments, FaYoutube, FaTwitter, FaDiscord, FaMediumM } from 'react-icons/fa';
// import { ImFileText2 } from 'react-icons/im';
// import { AiOutlineHome } from 'react-icons/ai';
// import { VscTasklist, VscKey } from 'react-icons/vsc';
// import { RiFileList3Line } from 'react-icons/ri';
// import { MdAlternateEmail } from 'react-icons/md';
// import { GiGearHammer } from 'react-icons/gi';
// import { BsQuestionCircle, BsMap } from 'react-icons/bs';
// import '../index.css';

import Howitworks from './Howitworks';
import Faq from './Faq';
import Roadmap from './Roadmap';
import Topnav from './Topnav';
import Whitepaper from './Whitepaper';
import Error from './Error';
import Home from './Home';
import Connect from './Connect';


const ReactRouterSetup = () => {
    return (
        <Router>
            <Topnav />
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path="/roadmap" element={<Roadmap/>}/>
                <Route path="/how-it-works" element={<Howitworks/>}/>
                <Route path="/white-paper" element={<Whitepaper/>}/>
                <Route path="/faq" element={<Faq/>}/>
                <Route path="/connect" element={<Connect/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
        </Router>
    )
};

export default ReactRouterSetup;