import React from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalContext } from "./context";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaPeopleArrows,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import ReactTooltip from "react-tooltip";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar, handleLogout } = useGlobalContext();
  return (
    <div
      className={`${
        isSidebarOpen ? "sidebar-wrapper show" : "sidebar-wrapper"
      }`}
    >
      <aside className="sidebar">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
        <div className="sidebar-links">
          <ul>
            <li>
              <Link className="link-btn" to="/" onClick={closeSidebar}>
                <FaHome data-tip data-for="homeTip" />
                <ReactTooltip id="homeTip" place="top" effect="solid">
                  Home
                </ReactTooltip>
              </Link>
            </li>
            <li>
              <Link className="link-btn" to="/search" onClick={closeSidebar}>
                <FaSearch data-tip data-for="searchTip" />
                <ReactTooltip id="searchTip" place="top" effect="solid">
                  Search
                </ReactTooltip>
              </Link>
            </li>
            <li>
              <Link className="link-btn" to="/page" onClick={closeSidebar}>
                <FaPeopleArrows data-tip data-for="peopleTip" />
                <ReactTooltip id="peopleTip" place="top" effect="solid">
                  Members
                </ReactTooltip>
              </Link>
            </li>
            {!localStorage.getItem("loggedin") ? (
              <li>
                <Link className="link-btn" to="/signup" onClick={closeSidebar}>
                  <FaUserPlus data-tip data-for="joinTip" />
                  <ReactTooltip id="joinTip" place="top" effect="solid">
                    Join BagheeraPost
                  </ReactTooltip>
                </Link>
              </li>
            ) : null}
          </ul>
          {localStorage.getItem("loggedin") ? (
            <div>
              <ul>
                <li>
                  <Link
                    className="link-btn"
                    to="/my-account"
                    onClick={closeSidebar}
                  >
                    <MdAccountCircle data-tip data-for="accTip" />
                    <ReactTooltip id="accTip" place="top" effect="solid">
                      Your Account
                    </ReactTooltip>
                  </Link>
                </li>
              </ul>
              <FaSignOutAlt
                data-tip
                data-for="logoutTip"
                onClick={handleLogout}
              />
              <ReactTooltip id="logoutTip" place="top" effect="solid">
                Signout
              </ReactTooltip>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
