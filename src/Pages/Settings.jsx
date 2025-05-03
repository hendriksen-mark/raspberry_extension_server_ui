import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Settings = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [isModified, setIsModified] = useState(false); // Track user modifications

  // Grouped state variables
  const [portConfig, setPortConfig] = useState({
    enabled: CONFIG.config.port.enabled,
    ports: CONFIG.config.port.ports,
  });

  const [protocols, setProtocols] = useState({
    yeelight: CONFIG.config.yeelight.enabled,
    native_multi: CONFIG.config.native_multi.enabled,
    tasmota: CONFIG.config.tasmota.enabled,
    wled: CONFIG.config.wled.enabled,
    shelly: CONFIG.config.shelly.enabled,
    esphome: CONFIG.config.esphome.enabled,
    hyperion: CONFIG.config.hyperion.enabled,
    tpkasa: CONFIG.config.tpkasa.enabled,
    elgato: CONFIG.config.elgato.enabled,
  });

  const [ipRange, setIpRange] = useState({
    IP_RANGE_START: CONFIG.config.IP_RANGE.IP_RANGE_START,
    IP_RANGE_END: CONFIG.config.IP_RANGE.IP_RANGE_END,
    SUB_IP_RANGE_START: CONFIG.config.IP_RANGE.SUB_IP_RANGE_START,
    SUB_IP_RANGE_END: CONFIG.config.IP_RANGE.SUB_IP_RANGE_END,
  });

  const [scanOnHostIP, setScanOnHostIP] = useState(CONFIG.config.scanonhostip);
  const [ip, setIp] = useState(CONFIG.config.ipaddress.replace("http://", ""));

  useEffect(() => {
    if (!isModified) {
      setPortConfig({
        enabled: CONFIG.config.port.enabled,
        ports: CONFIG.config.port.ports,
      });
      setProtocols({
        yeelight: CONFIG.config.yeelight.enabled,
        native_multi: CONFIG.config.native_multi.enabled,
        tasmota: CONFIG.config.tasmota.enabled,
        wled: CONFIG.config.wled.enabled,
        shelly: CONFIG.config.shelly.enabled,
        esphome: CONFIG.config.esphome.enabled,
        hyperion: CONFIG.config.hyperion.enabled,
        tpkasa: CONFIG.config.tpkasa.enabled,
        elgato: CONFIG.config.elgato.enabled,
      });
      setIpRange({
        IP_RANGE_START: CONFIG.config.IP_RANGE.IP_RANGE_START,
        IP_RANGE_END: CONFIG.config.IP_RANGE.IP_RANGE_END,
        SUB_IP_RANGE_START: CONFIG.config.IP_RANGE.SUB_IP_RANGE_START,
        SUB_IP_RANGE_END: CONFIG.config.IP_RANGE.SUB_IP_RANGE_END,
      });
      setScanOnHostIP(CONFIG.config.scanonhostip);
      setIp(CONFIG.config.ipaddress.replace("http://", ""));
    }
  }, [CONFIG, isModified]);

  // Handlers
  const handlePortChange = (value) => {
    setPortConfig((prev) => ({ ...prev, ports: value }));
    setIsModified(true);
  };

  const handleProtocolChange = (key, value) => {
    setProtocols((prev) => ({ ...prev, [key]: value }));
    setIsModified(true);
  };

  const handleIpRangeChange = (value, type) => {
    const [sub, ip] = value.split(".").slice(2).map(Number);
    setIpRange((prev) => ({
      ...prev,
      [type === "start" ? "SUB_IP_RANGE_START" : "SUB_IP_RANGE_END"]: sub,
      [type === "start" ? "IP_RANGE_START" : "IP_RANGE_END"]: ip,
    }));
    setIsModified(true);
  };

  // Modularized submit functions
  const submitConfig = (data, successMessage) => {
    axios
      .put(`${HOST_IP}/api/${API_KEY}/config`, data)
      .then(() => toast.success(successMessage))
      .catch((error) => toast.error(`Error occurred: ${error.message}`));
  };

  const onSubmitPort = () => {
    submitConfig(
      { port: { enabled: portConfig.enabled, ports: portConfig.ports.toString().match(/\d+/g).map(Number) } },
      "Port configuration saved successfully"
    );
  };

  const onSubmitProtocols = () => {
    submitConfig(
      { ...Object.keys(protocols).reduce((acc, key) => ({ ...acc, [key]: { enabled: protocols[key] } }), {}) },
      "Protocol configuration saved successfully"
    );
  };

  const onSubmitIpRange = () => {
    submitConfig(
      { IP_RANGE: ipRange },
      "IP range configuration saved successfully"
    );
  };

  const onSubmitScanOnHostIP = () => {
    submitConfig(
      { scanonhostip: scanOnHostIP },
      "Scan on host IP configuration saved successfully"
    );
  };

  // Render
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Add extra port for searching</div>
            <form className="add-form">
              <FlipSwitch
                id="ports"
                value={portConfig.enabled}
                onChange={(e) => setPortConfig((prev) => ({ ...prev, enabled: e }))}
                checked={portConfig.enabled}
                label="Enable"
                position="right"
              />
              <GenericText
                label="Port"
                type="text"
                placeholder="Additional ports"
                value={portConfig.ports}
                onChange={(e) => handlePortChange(e)}
              />
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitPort}
              />
            </form>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search IP Range Config</div>
            <GenericText
              label={`IP Range Start (${ip.split(".")[0]}.${ip.split(".")[1]}.xxx.yyy)`}
              type="text"
              value={`${ip.split(".")[0]}.${ip.split(".")[1]}.${ipRange.SUB_IP_RANGE_START}.${ipRange.IP_RANGE_START}`}
              onChange={(e) => handleIpRangeChange(e, "start")}
            />
            <GenericText
              label={`IP Range End (${ip.split(".")[0]}.${ip.split(".")[1]}.XXX.YYY)`}
              type="text"
              value={`${ip.split(".")[0]}.${ip.split(".")[1]}.${ipRange.SUB_IP_RANGE_END}.${ipRange.IP_RANGE_END}`}
              onChange={(e) => handleIpRangeChange(e, "end")}
            />
            <GenericButton
              value="Save"
              color="blue"
              size=""
              type="submit"
              onClick={onSubmitIpRange}
            />
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search Protocol Config</div>
            <form className="add-form">
              {Object.keys(protocols).map((key) => (
                <FlipSwitch
                  key={key}
                  id={key}
                  value={protocols[key]}
                  onChange={(e) => handleProtocolChange(key, e)}
                  checked={protocols[key]}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  position="right"
                />
              ))}
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitProtocols}
              />
            </form>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search on host IP</div>
            <form className="add-form">
              <FlipSwitch
                id="ScanOnHostIP"
                value={scanOnHostIP}
                onChange={(e) => setScanOnHostIP(e)}
                checked={scanOnHostIP}
                label="Enable"
                position="right"
              />
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitScanOnHostIP}
              />
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Settings;
