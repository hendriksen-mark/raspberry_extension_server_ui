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

import { FAN_CONFIG } from "../../Objects/fan_object";

const fanObject = ({ HOST_IP, id, fan }) => {
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

    const SetFullSpeed = () => {
        axios
            .get(`${HOST_IP}/fan/${id}/full_speed`)
            .then(() => {
                toast.success("Fan set to full speed");
            })
            .catch((error) => {
                console.error(error);
                toast.error(`Error occurred: ${error.message}`);
            });
    };

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        console.log("Saving fan configuration:", faninfo);
        axios
            .post(`${HOST_IP}/fan/${id}`, faninfo)
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

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setfanInfo((prevConfig) => ({
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
            .delete(`${HOST_IP}/fan/${id}`)
            .then(() => {
                toast.success("fan successfully deleted");
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
                {Object.entries(FAN_CONFIG).map(([key, config]) => (
                    <div className="form-control" key={key}>
                        <GenericText
                            label={config.label}
                            readOnly={true}
                            type={config.type}
                            placeholder={config.placeholder}
                            value={faninfo[key]}
                        />
                    </div>
                ))}
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
                {Object.entries(FAN_CONFIG).map(([key, config]) => (
                    <div className="form-control" key={key}>
                        <GenericText
                            label={config.label}
                            readOnly={false}
                            type={config.type}
                            placeholder={config.placeholder}
                            value={faninfo[key]}
                            onChange={(e) => handleConfigChange(key, e, config.datatype)}
                        />
                    </div>
                ))}
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
            <div className="form-control">
              <GenericButton
                value="Force Full Speed"
                color="blue"
                size=""
                type="submit"
                onClick={() => SetFullSpeed()}
              />
            </div>
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
