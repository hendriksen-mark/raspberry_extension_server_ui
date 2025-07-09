import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaPowerOff, FaCog, FaSignOutAlt, FaInfoCircle, FaUser, FaCode, FaTerminal } from "react-icons/fa";
import { MdDeviceThermostat } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import { GrFanOption } from "react-icons/gr";

import { SubMenu } from "../components/MenuItem/MenuItem";
import logo from "../static/images/logo.svg";

import "./sidebarSection.scss";

const SidebarSection = ({ showSidebar, setShowSidebar, isMobile }) => {
  const [currentElement, setCurrentElement] = useState(
    "#" + window.location.hash.substring(1)
  );

  const itemClicked = (link) => {
    if (isMobile) {
      setShowSidebar(false);
    }
    setCurrentElement(link);
  };

  const menuItems = [
    { label: "Thermostats", icon: MdDeviceThermostat, link: "#" },
    { label: "DHT", icon: WiHumidity, link: "#dht" },
    { label: "Klok", icon: FaClock, link: "#klok" },
    { label: "Fan", icon: GrFanOption, link: "#fan" },
    { label: "Power Button", icon: FaPowerOff, link: "#powerbutton" },
    { label: "Settings", icon: FaCog, link: "#settings" },
    { label: "Debug", icon: FaCode, link: "#debug" },
    { label: "Log Viewer", icon: FaTerminal, link: "#logviewer" },
    { label: "Account", icon: FaUser, link: "#account" },
    { label: "About", icon: FaInfoCircle, link: "#about" },
    { label: "Logout", icon: FaSignOutAlt, link: "/logout" },
  ];
// #region HTML
  return (
    <AnimatePresence initial={false}>
      {showSidebar && (
        <motion.div
          className="columnLeft"
          animate={{ width: 180 }}
          initial={{ width: 1 }}
          exit={{ width: 0 }}
        >
          <div className="topbarLeft active">
            <div className="logo">
              <img src={logo} alt="Raspberry Pi Logo" />
            </div>
            <div className="headline">Raspberry Pi</div>
          </div>
          <div className="sidebar">
            <SubMenu
              items={menuItems}
              currentElement={currentElement}
              itemClicked={itemClicked}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarSection;
