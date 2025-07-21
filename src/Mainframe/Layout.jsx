import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { toast } from "react-hot-toast";

import ContentSection from "./ContentSection";
import SidebarSection from "./SidebarSection";
import HeaderSection from "./HeaderSection";
import loading from "../components/Loader/Loader";

import "./layout.scss";
import "./scrollbar.scss";

const Layout = ({ HOST_IP }) => {
  //console.log("Layout: ", HOST_IP, API_KEY, CONFIG);

  const isMobile = useMediaQuery({ query: `(max-width: 750px)` });
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [CONFIG, setConfig] = useState({
    config: { webserver: { interval: 2000 } },
    thermostats: {},
    dht: {},
    klok: {},
    fan: {},
    powerbutton: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = () => {
      axios
        .get(`${HOST_IP}/system/all`)
        .then((fetchedData) => {
          if (fetchedData.data) {
            //console.log("CONFIG data fetched!", fetchedData.data);
            setConfig(fetchedData.data);
            setIsLoading(false); // Set loading to false once data is fetched
          } else {
            console.error("Incomplete CONFIG data fetched!", fetchedData.data);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
    };

    fetchConfig();

    const interval = setInterval(() => {
      fetchConfig();
    }, CONFIG.config.webserver.interval); // <<-- ⏱ 1000ms = 1s

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return loading("Config"); // Show loading spinner while fetching CONFIG data
  }
// #region HTML
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
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          CONFIG={CONFIG}
          isLoading={isLoading} // Pass loading state to HeaderSection
        />
        <ContentSection
          HOST_IP={HOST_IP}
          CONFIG={CONFIG}
        />
      </div>
    </>
  );
};

export default Layout;
