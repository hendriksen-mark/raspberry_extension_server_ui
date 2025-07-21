import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";

import "./headerSection.scss";
import NotificationCenter from "../components/NotificationCenter/NotificationCenter";

const HeaderSection = ({ HOST_IP, showSidebar, setShowSidebar, CONFIG, isLoading }) => {

  const iconVariants = {
    opened: {
      rotate: 90,
      //scale: 2
    },
    closed: {
      rotate: 0,
      //scale: 1
    },
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while CONFIG is loading
  }
// #region HTML
  return (
    <div className="topbarRight">
      <motion.div
        className="hamburger"
        initial={false}
        variants={iconVariants}
        animate={showSidebar ? "opened" : "closed"}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <FaBars />
      </motion.div>

      <div className="onbtn">
        <p>CPU Temperature: {CONFIG?.pi_temp}°C</p>
      </div>

      <NotificationCenter
        HOST_IP={HOST_IP}
        CONFIG={CONFIG}
      />
    </div>
  );
};

export default HeaderSection;
