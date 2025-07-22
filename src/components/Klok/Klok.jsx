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
import BrightnessSlider from "../BrightnessSlider/BrightnessSlider";
import FlipSwitch from "../FlipSwitch/FlipSwitch";

const KlokObject = ({ HOST_IP, klok }) => {
    const [Klokinfo, setKlokInfo] = useState(klok);
    const [power, setPower] = useState(klok.power_state);
    const [brightness, setBrightness] = useState(klok.brightness);
    const [CLK_pin, setCLKPin] = useState(klok.CLK_pin);
    const [DIO_pin, setDIOPin] = useState(klok.DIO_pin);
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [WizardName, setWizardName] = useState("");
    const [WizardContent, setWizardContent] = useState({});
    const [isModified, setIsModified] = useState(false); // Track user modifications

    useEffect(() => {
        if (!isModified) {
            setKlokInfo(klok);
        }
    }, [klok]);

    const onSubmit = () => {
        if (!isModified) {
            toast.error("No changes made to save.");
            return;
        }
        console.log("Saving Klok configuration:", Klokinfo);
        axios
            .post(`${HOST_IP}/Klok`, {
                CLK_pin: CLK_pin,
                DIO_pin: DIO_pin,
            })
            .then((response) => {
                toast.success("Klok configuration saved successfully");
                setIsModified(false); // Reset modified state after saving
                closeWizard();
            })
            .catch((error) => {
                console.error("Error saving Klok configuration:", error);
                toast.error("Failed to save Klok configuration");
            });

        setIsModified(false);
    };

    const updateKlok = async (updates) => {
        axios
            .get(`${HOST_IP}/klok/${updates}`)
            .then((fetchedData) => {
                //console.log("Klok updated successfully", fetchedData.data);
                toast.success("Klok updated successfully");
            })
            .catch((error) => {
                console.error("Error updating Klok:", error);
                toast.error("Failed to update Klok");
            });
    };

    const handleCLKChange = (value) => {
        setCLKPin(value);
        setIsModified(true); // Mark as modified
    };

    const handleDIOChange = (value) => {
        setDIOPin(value);
        setIsModified(true); // Mark as modified
    };

    const handlePowerChange = (value) => {
        setPower(value);
        setIsModified(true); // Mark as modified
        updateKlok(`${value ? "on" : "off"}`);
    };

    const handleBrightnessChange = (value) => {
        setBrightness(value);
        setIsModified(true); // Mark as modified
        updateKlok(`Bri/${value}`);
    };

    const deleteAlert = () => {
        confirmAlert({
            title: "Delete Klok Sensor",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => deleteKlok(),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const deleteKlok = () => {
        axios
            .delete(`${HOST_IP}/klok`)
            .then((fetchedData) => {
                //console.log(fetchedData.data);
                toast.success("Klok Sensor successfully deleted");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error occured, check browser console");
            });
    };
    const InfoKlok = () => {
        setWizardName("Device Information");
        setWizardContent(
            <>
                <p>Device Information for Klok</p>
                <div className="form-control">
                    <GenericText
                        label="CLK pin"
                        readOnly={true}
                        type="number"
                        placeholder="clk_pin"
                        value={Klokinfo.CLK_pin}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="DIO Pin"
                        readOnly={true}
                        type="number"
                        placeholder="DIO_pin"
                        value={Klokinfo.DIO_pin}
                    />
                </div>
            </>
        );
        openWizard();
    };
    const configureKlok = () => {
        setWizardName("Device Configuration");
        openWizard();
    };

    const getConfigurationContent = () => {
        return (
            <>
                <p>Change Configuration for Klok</p>
                <div className="form-control">
                    <GenericText
                        label="CLK pin"
                        readOnly={false}
                        type="number"
                        placeholder="clk_pin"
                        value={Klokinfo.CLK_pin}
                        onChange={(e) => handleCLKChange(parseInt(e))}
                    />
                </div>
                <div className="form-control">
                    <GenericText
                        label="DIO Pin"
                        readOnly={false}
                        type="number"
                        placeholder="DIO_pin"
                        value={Klokinfo.DIO_pin}
                        onChange={(e) => handleDIOChange(parseInt(e))}
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
            <div className="form-control">
                <FlipSwitch
                    id="power"
                    value={power}
                    onChange={(e) => handlePowerChange(e)}
                    checked={power}
                    label="Power"
                    position="right"
                />
            </div>
            <div className="form-control">
                <BrightnessSlider
                    defaultValue={brightness}
                    onChange={(e) => { handleBrightnessChange(e) }}
                    max={100}
                />
            </div>
            <div className="form-control">
                <div className="action-buttons">
                    <IconButton
                        iconName={IoIosInformationCircle}
                        title="Info"
                        size="small"
                        color="green"
                        onClick={() => InfoKlok()}
                    />
                    <IconButton
                        iconName={MdSettings}
                        title="Settings"
                        size="small"
                        color="blue"
                        onClick={() => configureKlok()}
                    />
                    <IconButton
                        iconName={MdDeleteForever}
                        title="Delete"
                        size="small"
                        color="red"
                        onClick={() => deleteAlert()}
                    />
                </div>
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

export default KlokObject;
