import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { FaPowerOff, FaFire, FaAdjust } from "react-icons/fa";
import { BsThermometerHalf, BsDropletHalf } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import Wizard from "../Wizard/Wizard";

import GlassContainer from "../GlassContainer/GlassContainer";
import IconButton from "../IconButton/IconButton";
import confirmAlert from "../reactConfirmAlert/reactConfirmAlert";
import GenericText from "../GenericText/GenericText";
import GenericButton from "../GenericButton/GenericButton";

import "./ThermostatControl.scss";

const Thermostat = ({ HOST_IP, id, thermostat }) => {
    const [thermostatinfo, setThermostat] = useState(thermostat);
    const [targetTemperature, setTargetTemperature] = useState(thermostat.targetTemperature);
    const [targetMode, setTargetMode] = useState(thermostat.targetMode);
    const [isDragging, setIsDragging] = useState(false);
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [WizardName, setWizardName] = useState("");
    const [WizardContent, setWizardContent] = useState({});
    const [isModified, setIsModified] = useState(false); // Track user modifications
    const [MaxTemperature, setMaxTemperature] = useState(thermostat.max_temperature);
    const [MinTemperature, setMinTemperature] = useState(thermostat.min_temperature);

    // Thermostat mode constants
    const MODES = {
        OFF: 0,
        HEAT: 1,
        AUTO: 3
    };

    const MODE_LABELS = {
        [MODES.OFF]: "Off",
        [MODES.HEAT]: "Heat",
        [MODES.AUTO]: "Auto"
    };

    const MODE_ICONS = {
        [MODES.OFF]: FaPowerOff,
        [MODES.HEAT]: FaFire,
        [MODES.AUTO]: FaAdjust
    };

    useEffect(() => {
        setThermostat(thermostat);
        if (!isModified) {
            setThermostat(thermostat);
            setTargetTemperature(thermostat.targetTemperature);
            setTargetMode(thermostat.targetHeatingCoolingState);
            setMaxTemperature(thermostat.max_temperature);
            setMinTemperature(thermostat.min_temperature);
        }
    }, [thermostat, isModified]);

    const updateThermostat = async (updates) => {
        axios
            .get(`${HOST_IP}/${thermostatinfo["mac"]}/${updates}`)
            .then((fetchedData) => {
                //console.log("Thermostat updated successfully", fetchedData.data);
                toast.success("Thermostat updated successfully");
            })
            .catch((error) => {
                console.error("Error updating thermostat:", error);
                toast.error("Failed to update thermostat");
            });
    };

    const handleModeChange = (mode) => {
        setTargetMode(mode);
        setIsModified(true); // Mark as modified
        updateThermostat(`/targetHeatingCoolingState/?value=${mode}`);
    };

    const handleTemperatureChange = (newTemp) => {
        if (!isDragging) {
            setTargetTemperature(newTemp);
            updateThermostat(`/targetTemperature/?value=${newTemp}`);
        } else {
            setTargetTemperature(newTemp);
        }
        setIsModified(true); // Mark as modified
    };

    const handleTemperatureDragEnd = () => {
        setIsDragging(false);
        updateThermostat(`/targetTemperature/?value=${targetTemperature}`);
    };

    const handleMaxTemperatureChange = (value) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setMaxTemperature(numValue);
            setIsModified(true); // Mark as modified
        }
    };

    const handleMinTemperatureChange = (value) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setMinTemperature(numValue);
            setIsModified(true); // Mark as modified
        }
    };

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        axios
            .post(`${HOST_IP}/${thermostatinfo["mac"]}`, {
                max_temperature: MaxTemperature,
                min_temperature: MinTemperature
            })
            .then((response) => {
                toast.success("Thermostat configuration saved successfully");
                setIsModified(false); // Reset modified state after saving
                closeWizard();
            })
            .catch((error) => {
                console.error("Error saving thermostat configuration:", error);
                toast.error("Failed to save thermostat configuration");
            });
    };

    const getTemperatureCircleClass = () => {
        if (!thermostatinfo) return "temperature-circle-neutral";

        const current = thermostatinfo.currentHeatingCoolingState;
        const target = thermostatinfo.targetHeatingCoolingState;

        if (target === 0) return "temperature-circle-off";
        if (current === 1 && target > 0) return "temperature-circle-heating";
        if (current === 2 && target > 0) return "temperature-circle-cooling";
        if (target > 0 && current === 0) return "temperature-circle-idle";

        return "temperature-circle-neutral";
    };

    const deleteAlert = () => {
        confirmAlert({
            title: "Delete thermostat " + thermostatinfo["mac"],
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deleteThermostat(),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const deleteThermostat = () => {
        axios
            .delete(`${HOST_IP}/${thermostatinfo["mac"]}`)
            .then((fetchedData) => {
                //console.log(fetchedData.data);
                toast.success("Thermostat successfully deleted");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error occured, check browser console");
            });
    };
    const InfoThermostat = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for {thermostatinfo.mac}</p>
                <div className="form-control">
                    <GenericText
                        label="MAC Address"
                        readOnly={true}
                        type="text"
                        placeholder="mac"
                        value={thermostatinfo.mac}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Last Updated"
                        readOnly={true}
                        type="text"
                        placeholder="last_updated"
                        value={thermostatinfo?.last_updated?.toLocaleString()}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="First Seen"
                        readOnly={true}
                        type="text"
                        placeholder="first_seen"
                        value={thermostatinfo?.first_seen?.toLocaleString()}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="DHT Sensor"
                        readOnly={true}
                        type="text"
                        placeholder="DHT Sensor"
                        value={thermostatinfo.DHT_connected ? 'Connected' : 'Disconnected'}
                    />
                </div>
            </>
        );
        openWizard();
    };
    const configureThermostat = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for {thermostatinfo.mac}</p>
                <div className="form-control">
                    <GenericText
                        label="Max Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="max_temperature"
                        value={String(MaxTemperature)}
                        onChange={(e) => handleMaxTemperatureChange(e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="min_temperature"
                        value={String(MinTemperature)}
                        onChange={(e) => handleMinTemperatureChange(e)}
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
            </>
        );
    };

    const openWizard = () => {
        setWizardIsOpen(true);
    };

    const closeWizard = () => {
        setWizardIsOpen(false);
    };
    // #region HTML
    return (<>
        <GlassContainer>
            <div className="thermostat-display">
                <h3>{thermostatinfo.mac}</h3>
                {/* Main Temperature Display */}
                <div className={`temperature-circle temperature-circle-big ${getTemperatureCircleClass()}`}>
                    {thermostatinfo.currentTemperature.toFixed(1)}°C
                </div>

                {/* Humidity Display */}
                {thermostatinfo.DHT_connected && (
                    <div className="humidity-drop humidity-drop-big">
                        <div className="humidity-drop-text">
                            {thermostatinfo.currentRelativeHumidity}%
                        </div>
                    </div>
                )}

                {/* Status Indicators */}
                <div className="status-indicators">
                    <div className="status-row">
                        <div className="status-item">
                            <BsThermometerHalf />
                            <span>Current: {thermostatinfo.currentTemperature.toFixed(1)}°C</span>
                        </div>
                        {thermostatinfo.DHT_connected && (
                            <div className="status-item">
                                <BsDropletHalf />
                                <span>Humidity: {thermostatinfo.currentRelativeHumidity}%</span>
                            </div>
                        )}
                    </div>
                    <div className="status-item">
                        <span className={`connection-status ${thermostatinfo.failed_connection ? 'offline' : 'online'}`}>
                            {thermostatinfo.failed_connection ? 'Offline' : 'Online'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mode-control">
                <h3>Mode Control</h3>
                <div className="mode-buttons">
                    {Object.entries(MODES).map(([key, value]) => {
                        const IconComponent = MODE_ICONS[value];
                        return (
                            <button
                                key={value}
                                className={`mode-button ${targetMode === value ? 'active' : ''}`}
                                onClick={() => handleModeChange(value)}
                                disabled={thermostatinfo.failed_connection}
                            >
                                <div className="mode-icon">
                                    <IconComponent />
                                </div>
                                <span>{MODE_LABELS[value]}</span>
                                {targetMode === value && (
                                    <div className="active-indicator">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="temperature-control">
                <h3>Target Temperature: {targetTemperature.toFixed(1)}°C</h3>
                <div className="temperature-slider-container">
                    <input
                        type="range"
                        min={thermostat.min_temperature}
                        max={thermostat.max_temperature}
                        step="0.5"
                        value={targetTemperature}
                        onChange={(e) => {
                            setIsDragging(true);
                            handleTemperatureChange(parseFloat(e.target.value));
                        }}
                        onMouseUp={handleTemperatureDragEnd}
                        onTouchEnd={handleTemperatureDragEnd}
                        className="temperature-slider"
                        disabled={thermostatinfo.failed_connection}
                    />
                    <div className="temperature-range">
                        <span>{thermostat.min_temperature}°C</span>
                        <span>{thermostat.max_temperature}°C</span>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <IconButton
                    iconName={IoIosInformationCircle}
                    title="Info"
                    size="small"
                    color="green"
                    onClick={() => InfoThermostat()}
                />
                <IconButton
                    iconName={MdSettings}
                    title="Settings"
                    size="small"
                    color="blue"
                    onClick={() => configureThermostat()}
                />
                <IconButton
                    iconName={MdDeleteForever}
                    title="Delete"
                    size="small"
                    color="red"
                    onClick={() => deleteAlert()}
                />
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={closeWizard}
                headline={WizardName}
            >
                {WizardName === "Device Configuration" ? getConfigurationContent() : WizardContent}
            </Wizard>
        </GlassContainer>
    </>
    );
};

export default Thermostat;
