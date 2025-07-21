import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import axios from "axios";

import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import DHTObject from "../components/DHT/DHT";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import GenericText from "../components/GenericText/GenericText";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import AddDHT from "../components/addDHT/addDHT";
import PageContent from "../components/PageContent/PageContent";

export default function DHT({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [dhtinfo, setDhtInfo] = useState(CONFIG.dht);
    const [dhtConfig, setDhtConfig] = useState(CONFIG.config.dht);
    const [isModified, setIsModified] = useState(false); // Track user modifications

    const openWizard = () => {
        setWizardIsOpen(true);
    };

    const closeWizard = (save = false) => {
        if (save) {
            setWizardIsOpen(false);
        } else {
            confirmAlert({
                title: "Confirm to close",
                message: "You have unsaved changes. Are you sure you want to close?",
                buttons: [
                    {
                        label: "Yes",
                        onClick: () => setWizardIsOpen(false),
                    },
                    {
                        label: "No",
                        onClick: () => { },
                    },
                ],
            });
        }
    };

    useEffect(() => {
        setDhtInfo(CONFIG.dht);
        if (!isModified) {
            setDhtConfig(CONFIG.config.dht);
        }
    }, [CONFIG]);

    const handleEnableChange = (key, value) => {
        setDhtConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
        updateConfig(key, value);
    };

    const handleIntervalChange = (e) => {
        const value = parseInt(e, 10);
        if (!isNaN(value)) {
            setDhtConfig((prevConfig) => ({
                ...prevConfig,
                interval: value
            }));
            setIsModified(true); // Mark as modified
            updateConfig("interval", value);
        }
    };

    const updateConfig = (key, value) => {
        axios
            .put(`${HOST_IP}/config`, {
                "dht": {
                    [key]: value
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`Configuration updated: ${key} = ${value}`);
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
    // #region HTML
    return (
        <div className="content">
            <div className="inner">
                <CardGrid options="main">
                    <GlassContainer options="spacer">
                        <PageContent>
                            <div className="top">
                                <div className="row1">
                                    <div className="icon">
                                        <WiHumidity />
                                    </div>
                                    <div className="text">DHT Settings</div>
                                    {(!dhtinfo || Object.keys(dhtinfo).length === 0) && (
                                        <IconButton
                                            iconName={BsPlusCircle}
                                            title="Add DHT Sensor"
                                            size="small"
                                            color="green"
                                            onClick={() => openWizard()}
                                        />
                                    )}
                                </div>
                                <FlipSwitch
                                    id="enabled"
                                    value={dhtConfig.enabled}
                                    onChange={(e) => handleEnableChange("enabled", e)}
                                    checked={dhtConfig.enabled}
                                    label="enabled"
                                    position="right"
                                />
                                <GenericText
                                    label="Interval"
                                    readOnly={false}
                                    type="number"
                                    placeholder="interval"
                                    value={String(dhtConfig.interval)}
                                    onChange={(e) => handleIntervalChange(e)}
                                />
                            </div>
                        </PageContent>
                    </GlassContainer>
                </CardGrid>

                <CardGrid>
                    {(dhtinfo && Object.keys(dhtinfo).length > 0) && (
                        <DHTObject
                            HOST_IP={HOST_IP}
                            dht={dhtinfo}
                        />
                    )}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add DHT Sensor"
            >
                <AddDHT HOST_IP={HOST_IP} closeWizard={closeWizard} />
            </Wizard>
        </div>
    );
}