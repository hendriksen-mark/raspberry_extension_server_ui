import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from "react-hot-toast";

import axios from "axios";

import Layout from "./Mainframe/Layout";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const App = () => {
  const [API_KEY, setAPI_KEY] = useState("");
  const [CONFIG, setConfig] = useState({
    config: {},
    lights: {},
    groups: {},
    scenes: {},
    rules: {},
    resourcelinks: {},
    schedules: {},
    sensors: {},
    behavior_instance: {},
    smart_scene: {},
    lightTypes: {},
  });

  const HOST_IP = ""; // Pass the IP (http://x.x.x.x) of the diyHue Bridge, if running through npm start

  useEffect(() => {
    const getAPI_KEY = () => {
      //console.log(`${HOST_IP}/get-key`);
      axios
        .get(`${HOST_IP}/get-key`)
        .then((result) => {
          if (typeof result.data === "string" && result.data.length === 32) {
            //console.log(`API_KEY from ${HOST_IP}: ${result.data}`);
            setAPI_KEY(result.data);
            fetchConfig(result.data);
            return result.data;
          } else {
            console.error(`Unable to fetch API_KEY! from ${HOST_IP}/get-key`);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
      //console.log(`API_KEY: ${API_KEY}`);
    };

    const fetchConfig = (api_key) => {
      //console.log("Fetching CONFIG data...", apiKey ? apiKey : "undefined");
      axios
        .get(`${HOST_IP}/api/${api_key}/all_data`)
        .then((fetchedData) => {
          if (fetchedData.data) {
            //console.log("CONFIG data fetched!", fetchedData.data);
            setConfig(fetchedData.data);
          } else {
            console.error("Incomplete CONFIG data fetched!", api_key, fetchedData.data);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
    };

    getAPI_KEY();

    const interval = setInterval(() => {
      if (API_KEY.length === 32) {
        fetchConfig(API_KEY);
      } else {
        console.error("API_KEY is missing: " + (API_KEY ? API_KEY : "undefined"));
        getAPI_KEY();
      }
    }, 2000); // <<-- ⏱ 1000ms = 1s
    return () => clearInterval(interval);
  }, [API_KEY]);

  if (!CONFIG.config || !("bridgeid" in CONFIG.config)) {
    console.error("CONFIG is missing!"), CONFIG;
    return loading;
  } else if (API_KEY.length !== 32) {
    console.error("API_KEY is missing: " + API_KEY);
    return loading;
  } else {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <React.Suspense fallback={loading}>
          <Layout HOST_IP={HOST_IP} API_KEY={API_KEY} CONFIG={CONFIG} />
        </React.Suspense>
      </LocalizationProvider>
    );
  }
};

export default App;
