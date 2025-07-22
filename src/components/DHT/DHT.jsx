import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { BsThermometerHalf, BsDropletHalf } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import Wizard from "../Wizard/Wizard";

import GlassContainer from "../GlassContainer/GlassContainer";
import IconButton from "../IconButton/IconButton";
import confirmAlert from "../reactConfirmAlert/reactConfirmAlert";
import GenericText from "../GenericText/GenericText";
import GenericButton from "../GenericButton/GenericButton";

import "./DHT.scss";

const DHTObject = ({ HOST_IP, dht }) => {
    const [dhtinfo, setDHTInfo] = useState(dht);
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [WizardName, setWizardName] = useState("");
    const [WizardContent, setWizardContent] = useState({});
    const [isModified, setIsModified] = useState(false); // Track user modifications

    useEffect(() => {
        if (!isModified) {
            setDHTInfo(dht);
        }
    }, [dht]);

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        console.log("Saving DHT configuration:", dhtinfo);
        axios
            .post(`${HOST_IP}/dht`, {
                sensor_type: dhtinfo.sensor_type,
                sensor_pin: dhtinfo.sensor_pin,
                MAX_DHT_TEMP: dhtinfo.MAX_DHT_TEMP,
                MIN_DHT_TEMP: dhtinfo.MIN_DHT_TEMP,
                MAX_HUMIDITY: dhtinfo.MAX_HUMIDITY,
                MIN_HUMIDITY: dhtinfo.MIN_HUMIDITY,
                DHT_TEMP_CHANGE_THRESHOLD: dhtinfo.DHT_TEMP_CHANGE_THRESHOLD,
                DHT_HUMIDITY_CHANGE_THRESHOLD: dhtinfo.DHT_HUMIDITY_CHANGE_THRESHOLD
            })
            .then((response) => {
                toast.success("DHT configuration saved successfully");
                setIsModified(false); // Reset modified state after saving
                closeWizard();
            })
            .catch((error) => {
                console.error("Error saving DHT configuration:", error);
                toast.error("Failed to save DHT configuration");
            });
    };

    const handleConfigChange = (key, value) => {
        if (!isNaN(value)) {
            setDHTInfo((prevConfig) => ({
                ...prevConfig,
                [key]: value
            }));
            setIsModified(true); // Mark as modified
        }
    };

    const deleteAlert = () => {
        confirmAlert({
            title: "Delete DHT Sensor",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deleteDHT(),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const deleteDHT = () => {
        axios
            .delete(`${HOST_IP}/dht`)
            .then((fetchedData) => {
                //console.log(fetchedData.data);
                toast.success("DHT Sensor successfully deleted");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error occured, check browser console");
            });
    };
    const InfoDHT = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for DHT Sensor</p>
                <div className="form-control">
                    <GenericText
                        label="Sensor Type"
                        readOnly={true}
                        type="text"
                        placeholder="sensor_type"
                        value={dhtinfo.sensor_type}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Sensor Pin"
                        readOnly={true}
                        type="text"
                        placeholder="sensor_pin"
                        value={dhtinfo.sensor_pin}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Temperature"
                        readOnly={true}
                        type="text"
                        placeholder="max_temperature"
                        value={dhtinfo.MAX_DHT_TEMP}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Temperature"
                        readOnly={true}
                        type="text"
                        placeholder="min_temperature"
                        value={dhtinfo.MIN_DHT_TEMP}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Humidity"
                        readOnly={true}
                        type="text"
                        placeholder="MAX_HUMIDITY"
                        value={dhtinfo.MAX_HUMIDITY}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Humidity"
                        readOnly={true}
                        type="text"
                        placeholder="MIN_HUMIDITY"
                        value={dhtinfo.MIN_HUMIDITY}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Temperature Change Threshold"
                        readOnly={true}
                        type="text"
                        placeholder="TEMP_CHANGE_THRESHOLD"
                        value={dhtinfo.DHT_TEMP_CHANGE_THRESHOLD}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Humidity Change Threshold"
                        readOnly={true}
                        type="text"
                        placeholder="HUMIDITY_CHANGE_THRESHOLD"
                        value={dhtinfo.DHT_HUMIDITY_CHANGE_THRESHOLD}
                    />
                </div>
            </>
        );
        openWizard();
    };
    const configureDHT = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for DHT</p>
                <div className="form-control">
                    <GenericText
                        label="Sensor Type"
                        readOnly={false}
                        type="text"
                        placeholder="sensor_type"
                        value={dhtinfo.sensor_type}
                        onChange={(e) => handleConfigChange("sensor_type", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Sensor Pin"
                        readOnly={false}
                        type="number"
                        placeholder="dht_pin"
                        value={dhtinfo.dht_pin}
                        onChange={(e) => handleConfigChange("dht_pin", parseInt(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="max_temperature"
                        value={dhtinfo.MAX_DHT_TEMP}
                        onChange={(e) => handleConfigChange("MAX_DHT_TEMP", parseFloat(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="min_temperature"
                        value={dhtinfo.MIN_DHT_TEMP}
                        onChange={(e) => handleConfigChange("MIN_DHT_TEMP", parseFloat(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Humidity"
                        readOnly={false}
                        type="number"
                        placeholder="MAX_HUMIDITY"
                        value={dhtinfo.MAX_HUMIDITY}
                        onChange={(e) => handleConfigChange("MAX_HUMIDITY", parseFloat(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Humidity"
                        readOnly={false}
                        type="number"
                        placeholder="MIN_HUMIDITY"
                        value={dhtinfo.MIN_HUMIDITY}
                        onChange={(e) => handleConfigChange("MIN_HUMIDITY", parseFloat(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Temperature Change Threshold"
                        readOnly={false}
                        type="number"
                        placeholder="TEMP_CHANGE_THRESHOLD"
                        value={dhtinfo.DHT_TEMP_CHANGE_THRESHOLD}
                        onChange={(e) => handleConfigChange("DHT_TEMP_CHANGE_THRESHOLD", parseFloat(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Humidity Change Threshold"
                        readOnly={false}
                        type="number"
                        placeholder="HUMIDITY_CHANGE_THRESHOLD"
                        value={dhtinfo.DHT_HUMIDITY_CHANGE_THRESHOLD}
                        onChange={(e) => handleConfigChange("DHT_HUMIDITY_CHANGE_THRESHOLD", parseFloat(e))}
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
            <div className="dht-display">
                {/* Main Temperature Display */}
                <div className={`dht-temperature-circle`}>
                    {dhtinfo.latest_temperature?.toFixed(1)}°C
                </div>

                {/* Humidity Display */}
                <div className="dht-humidity-drop dht-humidity-drop-big">
                    <div className="dht-humidity-drop-text">
                        {dhtinfo.latest_humidity}%
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="status-indicators">
                    <div className="status-row">
                        <div className="status-item">
                            <BsThermometerHalf />
                            <span>Current: {dhtinfo.latest_temperature?.toFixed(1)}°C</span>
                        </div>
                        <div className="status-item">
                            <BsDropletHalf />
                            <span>Humidity: {dhtinfo.latest_humidity}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <IconButton
                    iconName={IoIosInformationCircle}
                    title="Info"
                    size="small"
                    color="green"
                    onClick={() => InfoDHT()}
                />
                <IconButton
                    iconName={MdSettings}
                    title="Settings"
                    size="small"
                    color="blue"
                    onClick={() => configureDHT()}
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

export default DHTObject;
