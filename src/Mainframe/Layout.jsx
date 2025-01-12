import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { toast } from "react-hot-toast";

import ContentSection from "./ContentSection";
import SidebarSection from "./SidebarSection";
import HeaderSection from "./HeaderSection";

import "./layout.scss";
import "./scrollbar.scss";

const Layout = ({ HOST_IP, API_KEY, CONFIG }) => {
  //console.log("Layout: ", HOST_IP, API_KEY, CONFIG);

  const isMobile = useMediaQuery({ query: `(max-width: 750px)` });
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  return (
    <>
      <SidebarSection
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isMobile={isMobile}
      />
      <div className="columnRight">
        <HeaderSection
          HOST_IP={HOST_IP}
          API_KEY={API_KEY}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          CONFIG={CONFIG}
        />
        <ContentSection
          HOST_IP={HOST_IP}
          API_KEY={API_KEY}
          CONFIG={CONFIG}
        />
      </div>
    </>
  );
};

export default Layout;
