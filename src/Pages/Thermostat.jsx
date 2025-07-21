import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { MdDeviceThermostat } from "react-icons/md";
import axios from "axios";

import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import Thermostat from "../components/Thermostat/Thermostat";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import GenericText from "../components/GenericText/GenericText";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import AddThermostat from "../components/addThermostat/addThermostat";
import PageContent from "../components/PageContent/PageContent";

export default function Thermostats({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [thermostats, setThermostats] = useState(CONFIG.thermostats);
    const [thermostatConfig, setThermostatConfig] = useState(CONFIG.config.thermostats);
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
        setThermostats(CONFIG.thermostats);
        if (!isModified) {
            setThermostatConfig(CONFIG.config.thermostats);
        }
    }, [CONFIG]);

    const handleEnableChange = (key, value) => {
        setThermostatConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
        updateConfig(key, value);
    };

    const handleIntervalChange = (e) => {
        const value = parseInt(e, 10);
        if (!isNaN(value)) {
            setThermostatConfig((prevConfig) => ({
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
                "thermostats": {
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
                                        <MdDeviceThermostat />
                                    </div>
                                    <div className="text">Thermostats Settings</div>
                                    <IconButton
                                        iconName={BsPlusCircle}
                                        title="Info"
                                        size="small"
                                        color="green"
                                        onClick={() => openWizard()}
                                    />
                                </div>
                                <FlipSwitch
                                    id="enable"
                                    value={thermostatConfig.enabled}
                                    onChange={(e) => handleEnableChange("enable", e)}
                                    checked={thermostatConfig.enabled}
                                    label="Enable"
                                    position="right"
                                />
                                <GenericText
                                    label="Interval"
                                    readOnly={false}
                                    type="number"
                                    placeholder="interval"
                                    value={String(thermostatConfig.interval)}
                                    onChange={(e) => handleIntervalChange(e)}
                                />
                            </div>
                        </PageContent>
                    </GlassContainer>
                </CardGrid>

                <CardGrid>
                    {Object.entries(thermostats).map(([id, thermostatconfig]) => (
                        <Thermostat
                            key={id}
                            HOST_IP={HOST_IP}
                            id={id}
                            thermostat={thermostatconfig}
                        />
                    ))}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add Thermostat"
            >
                <AddThermostat HOST_IP={HOST_IP} closeWizard={closeWizard} />
            </Wizard>
        </div>
    );
}