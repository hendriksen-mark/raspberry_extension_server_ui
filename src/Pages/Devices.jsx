import { useEffect, useState } from "react";

import CardGrid from "../components/CardGrid/CardGrid";
import Device from "../components/Device/Device";

const Devices = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [devices, setDevices] = useState(CONFIG.sensors);

  useEffect(() => {
    setDevices(CONFIG.sensors);
  }, [CONFIG.sensors]);

  return (
    <div className="content">
      <div className="inner">
        <CardGrid>
          {Object.entries(devices).map(
            ([id, device]) =>
              device["protocol"] !== "none" && (
                <Device
                  key={id}
                  HOST_IP={HOST_IP}
                  api_key={API_KEY}
                  id={id}
                  device={device}
                />
              )
          )}
        </CardGrid>
      </div>
    </div>
  );
};

export default Devices;
