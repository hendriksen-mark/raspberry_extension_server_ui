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

const powerbuttonObject = ({ HOST_IP, powerbutton }) => {
    const [powerbuttoninfo, setpowerbuttonInfo] = useState(powerbutton);
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [WizardName, setWizardName] = useState("");
    const [WizardContent, setWizardContent] = useState({});
    const [isModified, setIsModified] = useState(false); // Track user modifications

    useEffect(() => {
        if (!isModified) {
            setpowerbuttonInfo(powerbutton);
        }
    }, [powerbutton]);

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        console.log("Saving powerbutton configuration:", powerbuttoninfo);
        axios
            .post(`${HOST_IP}/powerbutton`, powerbuttoninfo)
            .then((response) => {
                toast.success("powerbutton configuration saved successfully");
                setIsModified(false); // Reset modified state after saving
                closeWizard();
            })
            .catch((error) => {
                console.error("Error saving powerbutton configuration:", error);
                toast.error("Failed to save powerbutton configuration");
            });

        setIsModified(false);
    };

    const handleConfigChange = (key, value) => {
        if (!isNaN(value)) {
            setpowerbuttonInfo((prevConfig) => ({
                ...prevConfig,
                [key]: value
            }));
            setIsModified(true); // Mark as modified
        }
    };

    const deleteAlert = () => {
        confirmAlert({
            title: "Delete powerbutton Sensor",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deletepowerbutton(),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const deletepowerbutton = () => {
        axios
            .delete(`${HOST_IP}/powerbutton`)
            .then((fetchedData) => {
                //console.log(fetchedData.data);
                toast.success("powerbutton Sensor successfully deleted");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error occured, check browser console");
            });
    };
    const Infopowerbutton = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for powerbutton</p>
                <div className="form-control">
                    <GenericText
                        label="Button pin"
                        readOnly={true}
                        type="number"
                        placeholder="button_pin"
                        value={powerbuttoninfo.button_pin}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Long Press Duration"
                        readOnly={true}
                        type="number"
                        placeholder="long_press_duration"
                        value={powerbuttoninfo.long_press_duration}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Debounce Time"
                        readOnly={true}
                        type="number"
                        placeholder="debounce_time"
                        value={powerbuttoninfo.debounce_time}
                    />
                </div>
            </>
        );
        openWizard();
    };
    const configurepowerbutton = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for powerbutton</p>
                <div className="form-control">
                    <GenericText
                        label="Button pin"
                        readOnly={false}
                        type="number"
                        placeholder="button_pin"
                        value={powerbuttoninfo.button_pin}
                        onChange={(e) => handleConfigChange("button_pin", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Long Press Duration"
                        readOnly={false}
                        type="number"
                        placeholder="long_press_duration"
                        value={powerbuttoninfo.long_press_duration}
                        onChange={(e) => handleConfigChange("long_press_duration", e)}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="Debounce Time"
                        readOnly={false}
                        type="number"
                        placeholder="debounce_time"
                        value={powerbuttoninfo.debounce_time}
                        onChange={(e) => handleConfigChange("debounce_time", e)}
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
                    onClick={() => Infopowerbutton()}
                />
                <IconButton
                    iconName={MdSettings}
                    title="Settings"
                    size="small"
                    color="blue"
                    onClick={() => configurepowerbutton()}
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

export default powerbuttonObject;
