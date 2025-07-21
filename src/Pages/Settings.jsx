import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Settings = ({ HOST_IP, CONFIG }) => {
  const [webserverConfig, setWebserverConfig] = useState(CONFIG.config.webserver);
  const [isModified, setIsModified] = useState(false); // Track user modifications

  useEffect(() => {
    if (!isModified) {
      setWebserverConfig(CONFIG.config.webserver);
    }
  }, [CONFIG, isModified]);

  const handleIntervalChange = (e) => {
    const value = parseInt(e, 10);
    if (!isNaN(value)) {
      setWebserverConfig((prevConfig) => ({
        ...prevConfig,
        interval: value
      }));
      setIsModified(true); // Mark as modified
    }
  };

  // Modularized submit functions
  const updateConfig = () => {
    axios
      .put(`${HOST_IP}/config`, {
        "webserver": webserverConfig
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(`Configuration updated`);
          toast.success("Configuration updated successfully");
          setIsModified(false); // Reset modified state after saving
          if (response.data.changes && response.data.changes.length > 0) {
            console.log(`Changes made: ${response.data.changes.join(', ')}`);
          }
        } else {
          console.error(`Failed to update configuration: ${response.data.message || response.data.error}`);
        }
      })
      .catch((error) => {
        console.error(`Error updating configuration: ${error.response?.data?.error || error.message}`);
      });
  };

  // Render
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Change the Webserver Configuration</div>
            <form className="add-form">
              <div className="form-control">
                <GenericText
                  label="Interval"
                  readOnly={false}
                  type="number"
                  placeholder="interval"
                  value={String(webserverConfig.interval)}
                  onChange={(e) => handleIntervalChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value="Save"
                  color="blue"
                  size=""
                  type="submit"
                  onClick={() => updateConfig()}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Settings;
