import React from 'react';

import './Header.css';

const Header = () => (
    <header
        className="aafvs-header">
        <img
            className="aavfs-header__icon"
            src="checkmark.png"
            alt="Checkmark icon" />
        <h1
            className="aavfs-header__title">
            <span className="aavfs-header__title-top">Accurate & Flawless</span>
            <span className="aavfs-header__title-separator" />
            <span className="aavfs-header__title-bottom">Voting System</span>
        </h1>
    </header>
);

export default Header;
