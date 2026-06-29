import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import Wizard from "../Wizard/Wizard";

import GlassContainer from "../GlassContainer/GlassContainer";
import IconButton from "../IconButton/IconButton";
import confirmAlert from "../reactConfirmAlert/reactConfirmAlert";
import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { POWERBUTTON_CONFIG } from "../../Objects_Config/powerbutton_config";

const PowerButtonObject = ({ HOST_IP, powerbutton }) => {
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
        const payload = Object.keys(POWERBUTTON_CONFIG).reduce((accumulator, key) => {
            accumulator[key] = powerbuttoninfo[key];
            return accumulator;
        }, {});
        axios
            .post(`${HOST_IP}/powerbutton`, payload)
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

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setpowerbuttonInfo((prevConfig) => ({
                ...prevConfig,
                [key]: value
            }));
            setIsModified(true); // Mark as modified
            return;
        }

        if (datatype === "int") {
            value = parseInt(value, 10);
        } else if (datatype === "float") {
            value = parseFloat(value);
        }

        if (Number.isNaN(value)) {
            return;
        }

        setpowerbuttonInfo((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
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
    const InfoPowerButton = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for powerbutton</p>
                <ConfigFieldGroup config={POWERBUTTON_CONFIG} values={powerbuttoninfo} readOnly={true} />
            </>
        );
        openWizard();
    };
    const ConfigurePowerButton = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for powerbutton</p>
                <ConfigFieldGroup
                    config={POWERBUTTON_CONFIG}
                    values={powerbuttoninfo}
                    onChange={handleConfigChange}
                />
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
                    onClick={() => InfoPowerButton()}
                />
                <IconButton
                    iconName={MdSettings}
                    title="Settings"
                    size="small"
                    color="blue"
                    onClick={() => ConfigurePowerButton()}
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

export default PowerButtonObject;
