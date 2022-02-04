import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../bagheera-logo.jpeg";
import {
  FaBars,
  FaHome,
  FaSearch,
  FaPeopleArrows,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import Sidebar from "../Sidebar";
import ReactTooltip from "react-tooltip";

import { useGlobalContext } from "../context";

const Navbar = () => {
  const { loggedin, handleLogout, openSidebar } = useGlobalContext();

  return (
    <nav className="navbar">
      <section className="nav-center">
        <button className="toggle-btn" onClick={openSidebar}>
          <FaBars />
        </button>
        <img style={{ width: "90px" }} src={logo} />
        <h1 className="bagheera-banner" style={{ fontFamily: "cursive" }}>
          <span style={{ color: "#059e70" }}>B</span>agheera
          <span style={{ color: "#059e70" }}>P</span>ost
        </h1>

        <Sidebar />
        {loggedin || localStorage.getItem("loggedin") ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <ul className="nav-links">
              <li>
                <Link style={{ fontSize: "25px" }} className="link-btn" to="/">
                  <FaHome data-tip data-for="homeTip"/>
                  <ReactTooltip id="homeTip" place="top" effect="solid">
                    Home
                  </ReactTooltip>
                </Link>
              </li>
              <li>
                <Link
                  style={{ fontSize: "25px" }}
                  className="link-btn"
                  to="/search"
                >
                  <FaSearch data-tip data-for="searchTip"/>
                  <ReactTooltip id="searchTip" place="top" effect="solid">
                    Search
                  </ReactTooltip>
                </Link>
              </li>
              <li>
                <Link
                  style={{ fontSize: "25px" }}
                  className="link-btn"
                  to="/page"
                >
                  <FaPeopleArrows data-tip data-for="peopleTip" />
                  <ReactTooltip id="peopleTip" place="top" effect="solid">
                    Members
                  </ReactTooltip>
                </Link>
              </li>
              <li>
                <Link
                  style={{ fontSize: "25px" }}
                  className="link-btn"
                  to="/my-account"
                >
                  <MdAccountCircle data-tip data-for="accountTip"/>
                  <ReactTooltip id="accountTip" place="top" effect="solid">
                    Your Account
                  </ReactTooltip>
                </Link>
              </li>
              <li>
                <Link
                  style={{ fontSize: "25px" }}
                  className="lin-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt data-tip data-for="logoutTip"/>
                  <ReactTooltip id="logoutTip" place="top" effect="solid">
                    Logout
                  </ReactTooltip>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <ul className="nav-links">
            <li>
              <Link style={{ fontSize: "15px" }} className="link" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link style={{ fontSize: "15px" }} className="link" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link style={{ fontSize: "15px" }} className="link" to="/signup">
                Join
              </Link>
            </li>
          </ul>
        )}
      </section>
    </nav>
  );
};

export default Navbar;
