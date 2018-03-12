import React from "react";
import { PopoutIcon } from "./Icon";
import logoIcon from "./logo-icon.svg";

import "./Header.css";

const Header = ({ embedded }) => {
  return (
    <header className="header">
      <div className="header__container">
        <a
          href="https://kenyoncollegian.com"
          title="Go to the Kenyon Collegian"
          className="header__link header__link--home"
          aria-label="Go to the Kenyon Collegian"
        >
          <img
            src={logoIcon}
            className="header__logo header__logo--icon"
            alt="The Kenyon Collegian"
          />
        </a>
        <h1 className="header__title">Tipline</h1>
        {embedded && (
          <a
            href="/"
            target="_blank"
            title="Open in a new window"
            className="header__link header__link--popout"
            aria-label="Open in a new window"
          >
            <PopoutIcon
              className="header__icon header__icon--popout"
              aria-hidden="true"
              size={20}
            />
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
