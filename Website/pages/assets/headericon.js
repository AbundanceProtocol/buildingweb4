import React from 'react';
import { FaSearch, FaCode, FaUser, FaLightbulb, FaKey, FaLockOpen, FaGlobe } from 'react-icons/fa';

const HeaderIcon = (props) => {
return (
    <div className="size-87 flex-col flex-middle">
    <div className="flex-col flex-middle">
        <Icon iconType={props.iconType} iconStyle={props.iconStyle} className="" />
        <div className="font-15 mar-t-6">{props.iconType}</div>
    </div>
    </div>
);
}

function Icon(props) {
const HeaderIcon = icons[props.iconType];
return <HeaderIcon className={props.iconStyle} />
}

const icons = {
    'portal': FaUser,
    'about': FaLightbulb,
    'connect': FaKey,
    'disconnect': FaLockOpen,
    'explore': FaGlobe,
    'search': FaSearch
}

export default HeaderIcon;