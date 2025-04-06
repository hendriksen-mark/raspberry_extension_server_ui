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
  const [API_KEY, setAPI_KEY] = useState(""); // Initialize API_KEY with an empty string
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const HOST_IP = ""; // Pass the IP (http://x.x.x.x) of the diyHue Bridge, if running through npm start

  useEffect(() => {
    axios
      .get(`${HOST_IP}/get-key`)
      .then((result) => {
        if (typeof result.data === "string" && result.data.length === 32) {
          setAPI_KEY(result.data);
        } else {
          console.error(`Unable to fetch API_KEY! from ${HOST_IP}/get-key`);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false); // Ensure loading is set to false after the request
      });
  }, []);

  if (isLoading) {
    return loading; // Show loading spinner while fetching API_KEY
  }

  if (!API_KEY || API_KEY.length !== 32) {
    console.error("API_KEY is missing or invalid: " + API_KEY);
    return (
      <div className="error-message">
        <p>Error: Unable to fetch a valid API_KEY. Please check your configuration.</p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Suspense fallback={loading}>
        <Layout HOST_IP={HOST_IP} API_KEY={API_KEY} />
      </React.Suspense>
    </LocalizationProvider>
  );
};

export default App;
