import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Mqtt = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [enable, setEnable] = useState(CONFIG.config.mqtt?.enabled || false);
  const [mqttServer, setMqttServer] = useState(CONFIG.config.mqtt?.mqttServer || "mqtt");
  const [mqttPort, setMqttPort] = useState(CONFIG.config.mqtt?.mqttPort || 1883);
  const [mqttUser, setMqttUser] = useState(CONFIG.config.mqtt?.mqttUser || "");
  const [mqttPass, setMqttPass] = useState(CONFIG.config.mqtt?.mqttPassword || "");
  const [discoveryPrefix, setDiscoveryPrefix] = useState(CONFIG.config.mqtt?.discoveryPrefix || "homeassistant");
  const [isModified, setIsModified] = useState(false); // Track user modifications

  useEffect(() => {
    if (!isModified) {
      setEnable(CONFIG.config.mqtt?.enabled || false);
      setMqttServer(CONFIG.config.mqtt?.mqttServer || "mqtt");
      setMqttPort(CONFIG.config.mqtt?.mqttPort || 1883);
      setMqttUser(CONFIG.config.mqtt?.mqttUser || "");
      setMqttPass(CONFIG.config.mqtt?.mqttPassword || "");
      setDiscoveryPrefix(CONFIG.config.mqtt?.discoveryPrefix || "homeassistant");
    }
  }, [CONFIG, isModified]);

  const handleEnableChange = (value) => {
    setEnable(value);
    setIsModified(true); // Mark as modified
  };

  const handleMqttServerChange = (value) => {
    setMqttServer(value);
    setIsModified(true); // Mark as modified
  };

  const handleMqttPortChange = (value) => {
    setMqttPort(parseInt(value));
    setIsModified(true); // Mark as modified
  };

  const handleMqttUserChange = (value) => {
    setMqttUser(value);
    setIsModified(true); // Mark as modified
  };

  const handleMqttPassChange = (value) => {
    setMqttPass(value);
    setIsModified(true); // Mark as modified
  };

  const handleDiscoveryPrefixChange = (value) => {
    setDiscoveryPrefix(value);
    setIsModified(true); // Mark as modified
  };

  const onSubmit = () => {
    axios
      .put(`${HOST_IP}/api/${API_KEY}/config`, {
        mqtt: {
          enabled: enable,
          mqttServer: mqttServer,
          mqttPort: mqttPort,
          mqttUser: mqttUser,
          mqttPassword: mqttPass,
          discoveryPrefix: discoveryPrefix,
        },
      })
      .then((fetchedData) => {
        //console.log(fetchedData.data);
        toast.success("Successfully saved, please restart the service");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
  };
// #region HTML
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">ZigBee2MQTT config</div>
            <form className="add-form">
              <FlipSwitch
                id="mqtt"
                value={enable}
                onChange={(e) => handleEnableChange(e)}
                checked={enable}
                label="Enable"
                position="right"
              />
              <div className="form-control">
                <GenericText
                  label="MQTT server"
                  type="text"
                  placeholder="MQTT server"
                  value={mqttServer}
                  onChange={(e) => handleMqttServerChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="MQTT port"
                  type="number"
                  placeholder="MQTT port"
                  value={mqttPort}
                  onChange={(e) => handleMqttPortChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="MQTT username"
                  type="text"
                  placeholder="MQTT username"
                  value={mqttUser}
                  onChange={(e) => handleMqttUserChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="MQTT password"
                  type="password"
                  placeholder="MQTT password"
                  value={mqttPass}
                  onChange={(e) => handleMqttPassChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Discovery Prefix"
                  type="text"
                  placeholder="Discovery prefix"
                  value={discoveryPrefix}
                  onChange={(e) => handleDiscoveryPrefixChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value="Save"
                  color="blue"
                  size=""
                  type="submit"
                  onClick={() => onSubmit()}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Mqtt;
