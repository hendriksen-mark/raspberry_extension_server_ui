import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Tradfri = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [tradfriGwIp, setTradfriGwIp] = useState(CONFIG.config.tradfri?.tradfriGwIp || "192.168.x.x");
  const [tradfriCode, setTradfriCode] = useState(CONFIG.config.tradfri?.tradfriCode || "");
  const [tradfriIdentity, setTradfriIdentity] = useState(CONFIG.config.tradfri?.identity || "");
  const [tradfriPsk, setTradfriPsk] = useState(CONFIG.config.tradfri?.psk || "");

  useEffect(() => {
    setTradfriGwIp(CONFIG.config.tradfri?.tradfriGwIp || "192.168.x.x");
    setTradfriCode(CONFIG.config.tradfri?.tradfriCode || "");
    setTradfriIdentity(CONFIG.config.tradfri?.identity || "");
    setTradfriPsk(CONFIG.config.tradfri?.psk || "");
  }, [CONFIG]);

  const pairTradfri = () => {
    axios
      .post(
        `${HOST_IP}/tradfri`,
        {
          identity: tradfriIdentity,
          tradfriGwIp: tradfriGwIp,
          tradfriCode: tradfriCode,
        },
        { timeout: 2000 }
      )
      .then((result) => {
        //console.log(result.data);
        if (result.data["result"] === "success") {
          setTradfriPsk(result.data["psk"]["success"]);
          toast.success("Connected, now search for lights");
        } else {
          toast.error("Error:" + result.data["result"]);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
  };

  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">IKEA Tradfri Gateway</div>
            <form className="add-form">
              <div className="form-control">
                <GenericText
                  label="Tradfri Gateway IP"
                  type="text"
                  placeholder="192.168.x.x"
                  value={tradfriGwIp}
                  onChange={(e) => setTradfriGwIp(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Identity"
                  type="text"
                  placeholder="Identity used for pairing"
                  value={tradfriIdentity}
                  onChange={(e) => setTradfriIdentity(e)}
                />
              </div>
              {tradfriPsk === "" && (
                <div className="form-control">
                  <GenericText
                    label="Security Code"
                    type="password"
                    placeholder="Located on gateway label"
                    value={tradfriCode}
                    onChange={(e) => setTradfriCode(e)}
                  />
                </div>
              )}
              {tradfriPsk !== "" && (
                <div className="form-control">
                  <GenericText
                    label="Paired Key"
                    type="text"
                    readOnly={true}
                    placeholder="Located on gateway label"
                    value={tradfriPsk}
                  />
                </div>
              )}
              <div className="form-control">
                <GenericButton
                  value={
                    typeof tradfriPsk === "string" && tradfriPsk.length > 0
                      ? "Change Ip"
                      : "Pair"
                  }
                  color="blue"
                  size=""
                  type="submit"
                  onClick={() => pairTradfri()}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Tradfri;
