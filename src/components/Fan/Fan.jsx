import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import Wizard from "../Wizard/Wizard";

import GlassContainer from "../GlassContainer/GlassContainer";
import IconButton from "../IconButton/IconButton";
import confirmAlert from "../reactConfirmAlert/reactConfirmAlert";
import GenericText from "../GenericText/GenericText";
import GenericButton from "../GenericButton/GenericButton";

const fanObject = ({ HOST_IP, fan }) => {
    const [faninfo, setfanInfo] = useState(fan);
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [WizardName, setWizardName] = useState("");
    const [WizardContent, setWizardContent] = useState({});
    const [isModified, setIsModified] = useState(false); // Track user modifications

    useEffect(() => {
        if (!isModified) {
            setfanInfo(fan);
        }
    }, [fan]);

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        console.log("Saving fan configuration:", faninfo);
        axios
            .post(`${HOST_IP}/fan`, { faninfo })
            .then((response) => {
                toast.success("fan configuration saved successfully");
                setIsModified(false); // Reset modified state after saving
                closeWizard();
            })
            .catch((error) => {
                console.error("Error saving fan configuration:", error);
                toast.error("Failed to save fan configuration");
            });

        setIsModified(false);
    };

    const handleConfigChange = (key, value) => {
        if (!isNaN(value)) {
            setfanInfo((prevConfig) => ({
                ...prevConfig,
                [key]: value
            }));
            setIsModified(true); // Mark as modified
        }
    };

    const deleteAlert = () => {
        confirmAlert({
            title: "Delete fan Sensor",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deletefan(),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const deletefan = () => {
        axios
            .delete(`${HOST_IP}/fan`)
            .then((fetchedData) => {
                //console.log(fetchedData.data);
                toast.success("fan Sensor successfully deleted");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error occured, check browser console");
            });
    };
    const Infofan = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for fan</p>
                <div className="form-control">
                    <GenericText
                        label="GPIO pin"
                        readOnly={true}
                        type="number"
                        placeholder="gpio_pin"
                        value={faninfo.GPIO_pin}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="PWM Frequency"
                        readOnly={true}
                        type="number"
                        placeholder="pwm_frequency"
                        value={faninfo.pwm_frequency}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Temperature"
                        readOnly={true}
                        type="number"
                        placeholder="max_temperature"
                        value={faninfo.max_temperature}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Temperature"
                        readOnly={true}
                        type="number"
                        placeholder="min_temperature"
                        value={faninfo.min_temperature}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Speed"
                        readOnly={true}
                        type="number"
                        placeholder="max_speed"
                        value={faninfo.max_speed}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Speed"
                        readOnly={true}
                        type="number"
                        placeholder="min_speed"
                        value={faninfo.min_speed}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Temperature Change Threshold"
                        readOnly={true}
                        type="number"
                        placeholder="temp_change_threshold"
                        value={faninfo.temp_change_threshold}
                    />
                </div>
            </>
        );
        openWizard();
    };
    const configurefan = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for fan</p>
                <div className="form-control">
                    <GenericText
                        label="GPIO pin"
                        readOnly={false}
                        type="number"
                        placeholder="gpio_pin"
                        value={faninfo.GPIO_pin}
                        onChange={(e) => handleConfigChange("GPIO_pin", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="PWM Frequency"
                        readOnly={false}
                        type="number"
                        placeholder="pwm_frequency"
                        value={faninfo.pwm_frequency}
                        onChange={(e) => handleConfigChange("pwm_frequency", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="max_temperature"
                        value={faninfo.max_temperature}
                        onChange={(e) => handleConfigChange("max_temperature", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Temperature"
                        readOnly={false}
                        type="number"
                        placeholder="min_temperature"
                        value={faninfo.min_temperature}
                        onChange={(e) => handleConfigChange("min_temperature", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Max Speed"
                        readOnly={false}
                        type="number"
                        placeholder="max_speed"
                        value={faninfo.max_speed}
                        onChange={(e) => handleConfigChange("max_speed", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Min Speed"
                        readOnly={false}
                        type="number"
                        placeholder="min_speed"
                        value={faninfo.min_speed}
                        onChange={(e) => handleConfigChange("min_speed", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Temperature Change Threshold"
                        readOnly={false}
                        type="number"
                        placeholder="temp_change_threshold"
                        value={faninfo.temp_change_threshold}
                        onChange={(e) => handleConfigChange("temp_change_threshold", e)}
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
            <div className="action-buttons">
                <IconButton
                    iconName={IoIosInformationCircle}
                    title="Info"
                    size="small"
                    color="green"
                    onClick={() => Infofan()}
                />
                <IconButton
                    iconName={MdSettings}
                    title="Settings"
                    size="small"
                    color="blue"
                    onClick={() => configurefan()}
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

export default fanObject;
