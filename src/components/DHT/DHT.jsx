import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { BsThermometerHalf, BsDropletHalf } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";

import Wizard from "../Wizard/Wizard";
import GlassContainer from "../GlassContainer/GlassContainer";
import IconButton from "../IconButton/IconButton";
import confirmAlert from "../reactConfirmAlert/reactConfirmAlert";
import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { DHT_CONFIG } from "../../Objects_Config/dht_config";

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
        const payload = Object.keys(DHT_CONFIG).reduce((accumulator, key) => {
            accumulator[key] = dhtinfo[key];
            return accumulator;
        }, {});
        axios
            .post(`${HOST_IP}/dht`, payload)
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

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setDHTInfo((prevConfig) => ({
                ...prevConfig,
                [key]: value
            }));
            setIsModified(true);
            return;
        }

        if (datatype === "int") {
            value = parseInt(value, 10);
        } else if (datatype === "float") {
            value = parseFloat(value);
        }

        if (!Number.isNaN(value)) {
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
                <ConfigFieldGroup config={DHT_CONFIG} values={dhtinfo} readOnly={true} />
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
                <ConfigFieldGroup config={DHT_CONFIG} values={dhtinfo} onChange={handleConfigChange} />
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
