import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { saveAs } from "file-saver";

import Wizard from "../components/Wizard/Wizard";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";

const Settings = ({ HOST_IP, CONFIG }) => {
  const [ServerConfig, setServerConfig] = useState(CONFIG.config);
  const [isModified, setIsModified] = useState(false); // Track user modifications
  const [WizardIsOpen, setWizardIsOpen] = useState(false);
  const [WizardName, setWizardName] = useState("");
  const [WizardContent, setWizardContent] = useState({});
  const [AdvanceConfig, setAdvanceConfig] = useState(false);

  const openWizard = () => {
    setWizardIsOpen(true);
  };

  const closeWizard = () => {
    setWizardIsOpen(false);
  };

  useEffect(() => {
    if (!isModified) {
      setServerConfig(CONFIG.config);
    }
  }, [CONFIG, isModified]);

  const handleIntervalChange = (e) => {
    const value = parseInt(e, 10);
    if (!isNaN(value)) {
      setServerConfig((prevConfig) => ({
        ...prevConfig,
        webserver: {
          ...prevConfig.webserver,
          interval: value
        }
      }));
      setIsModified(true); // Mark as modified
    }
  };

  const handleBranchChange = (e) => {
    const value = e.trim();
    if (value) {
      setServerConfig((prevConfig) => ({
        ...prevConfig,
        system: {
          ...prevConfig.system,
          branch: value
        }
      }));
      setIsModified(true); // Mark as modified
    }
  };
  const handleLogLevelChange = (e) => {
    const value = e.trim();
    if (value) {
      setServerConfig((prevConfig) => ({
        ...prevConfig,
        system: {
          ...prevConfig.system,
          loglevel: value
        }
      }));
      setIsModified(true); // Mark as modified
    }
  };

  // Modularized submit functions
  const updateConfig = () => {
    // Create a copy of ServerConfig without the "users" field
    const { users, ...configWithoutUsers } = ServerConfig;
    
    axios
      .put(`${HOST_IP}/config`, configWithoutUsers)
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

  const ConfigOptions = () => {
    setWizardName("Force Config Dump Options");
    setWizardContent(
      <>
        <p>Where do you want to save config?</p>
        <p>Never share the config.tar!</p>
        <div className="form-control">
          <GenericButton
            value="DiyHue local"
            color="blue"
            size=""
            type="submit"
            onClick={() => dumpConfig(false)}
          />
        </div>
        <div className="form-control">
          <GenericButton
            value="DiyHue backup"
            color="blue"
            size=""
            type="submit"
            onClick={() => backupConfig()}
          />
        </div>
        <div className="form-control">
          <GenericButton
            value="Download tar"
            color="blue"
            size=""
            type="submit"
            onClick={() => downloadConfig()}
          />
        </div>
      </>
    );
    openWizard();
  };

  const dumpConfig = (restart) => {
    axios
      .get(`${HOST_IP}/save`)
      .then(() => {
        toast.success("Config dumped to local disk");
        if (restart === true) {
          Restart();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const backupConfig = () => {
    axios
      .get(`${HOST_IP}/save?backup=True`)
      .then(() => {
        toast.success("Backup to local disk");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const downloadConfig = () => {
    axios
      .get(`${HOST_IP}/download_config`, { responseType: "blob" })
      .then((response) => {
        saveAs(response.data, "config.tar");
        toast.success("Download config tar");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const RestartAlert = () => {
    confirmAlert({
      title: "Restart Python.",
      message:
        "Are you sure to do this?\nThis will NOT save the current config.",
      buttons: [
        {
          label: "Yes",
          onClick: () => Restart(),
        },
        {
          label: "Save first",
          onClick: () => dumpConfig(true),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const Restart = () => {
    axios
      .get(`${HOST_IP}/restart`)
      .then(() => {
        toast.success("Restart Python");
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          toast.success("Restart Python");
        } else {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        }
      })
  };

  const restoreOptions = () => {
    setWizardName("Reset Config Options");
    setWizardContent(
      <>
        <p>How do you want to restore config?</p>
        <p>Please be careful of what you do!</p>
        <div className="form-control">
          <GenericButton
            value="Restore backup"
            color="red"
            size=""
            type="submit"
            onClick={() => restoreAlert()}
          />
        </div>
        <div className="form-control">
          <GenericButton
            value="Reset config"
            color="red"
            size=""
            type="submit"
            onClick={() => resetAlert()}
          />
        </div>
      </>
    );
    openWizard();
  };

  const resetAlert = () => {
    confirmAlert({
      title: "Reset config to default.",
      message: "Are you sure to do this?\nThis also makes a backup.",
      buttons: [
        {
          label: "Yes",
          onClick: () => reset_config(),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const reset_config = () => {
    axios
      .get(`${HOST_IP}/reset_config`)
      .then(() => {
        toast.success("Reset config");
        Restart();
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const restoreAlert = () => {
    confirmAlert({
      title: "Restore config from backup.",
      message: "Are you sure to do this?\nThis will NOT make a backup.",
      buttons: [
        {
          label: "Yes",
          onClick: () => restore_config(),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const restore_config = () => {
    axios
      .get(`${HOST_IP}/restore_config`)
      .then(() => {
        toast.success("restore config");
        Restart();
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const debugOptions = () => {
    setWizardName("Debug download Options");
    setWizardContent(
      <>
        <p>Download full debug or log</p>
        <div className="form-control">
          <GenericButton
            value="Full Debug"
            color="blue"
            size=""
            type="submit"
            onClick={() => downloadDebugConfig()}
          />
        </div>
        <div className="form-control">
          <GenericButton
            value="Log file"
            color="blue"
            size=""
            type="submit"
            onClick={() => downloadLog()}
          />
        </div>
      </>
    );
    openWizard();
  };

  const downloadDebugConfig = () => {
    axios
      .get(`${HOST_IP}/download_debug`, { responseType: "blob" })
      .then((response) => {
        saveAs(response.data, "config_debug.tar");
        toast.success("Download debug tar");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
    closeWizard()
  };

  const downloadLog = () => {
    axios
      .get(`${HOST_IP}/download_log`, { responseType: "blob" })
      .then((response) => {
        saveAs(response.data, "diyhue_log.tar");
        toast.success("Download log tar");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });

    closeWizard()
  };

  // #region HTML
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
                  value={String(ServerConfig.webserver.interval)}
                  onChange={(e) => handleIntervalChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Branch"
                  readOnly={false}
                  type="text"
                  placeholder="branch"
                  value={String(ServerConfig.system.branch)}
                  onChange={(e) => handleBranchChange(e)}
                />
              </div>
              <div className="form-control">
                <FlipSwitch
                  id="Debug"
                  value={ServerConfig.system.loglevel === "DEBUG" ? true : false}
                  onChange={(e) => handleLogLevelChange(e === true ? "DEBUG" : "INFO")}
                  checked={ServerConfig.system.loglevel === "DEBUG" ? true : false}
                  label="Temporarily Enable Debug Log"
                  position="right"
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

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Server control</div>
            <div className="form-control">
              <GenericButton
                value={`${AdvanceConfig ? "Hide" : "Show"} advanced config`}
                color="blue"
                size=""
                type="submit"
                onClick={() => setAdvanceConfig(!AdvanceConfig)}
              />
            </div>
            <div className="form-control">
              <GenericButton
                value="Force Config Dump"
                color="blue"
                size=""
                type="submit"
                onClick={() => ConfigOptions()}
              />
            </div>
            <div className="form-control">
              <GenericButton
                value="Download debug"
                color="blue"
                size=""
                type="submit"
                onClick={() => debugOptions()}
              />
            </div>
            {AdvanceConfig === true && (<>
              <div className="form-control">
                <GenericButton
                  value="Restart Python"
                  color="red"
                  size=""
                  type="submit"
                  onClick={() => RestartAlert()}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value="Force Config Reset"
                  color="red"
                  size=""
                  type="submit"
                  onClick={() => restoreOptions()}
                />
              </div>
            </>)}
            <Wizard
              isOpen={WizardIsOpen}
              closeWizard={closeWizard}
              headline={WizardName}
            >
              {WizardContent}
            </Wizard>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Settings;
