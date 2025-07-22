import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { FaClock} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PowerButtonObject from "../components/PowerButton/PowerButton";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import AddPowerButton from "../components/addPowerButton/addPowerButton";
import PageContent from "../components/PageContent/PageContent";

export default function powerbutton({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [powerbuttoninfo, setpowerbuttonInfo] = useState(CONFIG.powerbutton);
    const [powerbuttonConfig, setpowerbuttonConfig] = useState(CONFIG.config.powerbutton);
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
        setpowerbuttonInfo(CONFIG.powerbutton);
        if (!isModified) {
            setpowerbuttonConfig(CONFIG.config.powerbutton);
        }
    }, [CONFIG]);

    const handleEnableChange = (key, value) => {
        setpowerbuttonConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
        updateConfig(key, value);
    };

    const updateConfig = (key, value) => {
        axios
            .put(`${HOST_IP}/config`, {
                "powerbutton": {
                    [key]: value
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`Configuration updated: ${key} = ${value}`);
                    toast.success(`Configuration updated: ${key} = ${value}`);
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
                                        <FaClock />
                                    </div>
                                    <div className="text">PowerButton Settings</div>
                                    {(!powerbuttoninfo || Object.keys(powerbuttoninfo).length === 0) && (
                                        <IconButton
                                            iconName={BsPlusCircle}
                                            title="Add PowerButton"
                                            size="small"
                                            color="green"
                                            onClick={() => openWizard()}
                                        />
                                    )}
                                </div>
                                <FlipSwitch
                                    id="enabled"
                                    value={powerbuttonConfig.enabled}
                                    onChange={(e) => handleEnableChange("enabled", e)}
                                    checked={powerbuttonConfig.enabled}
                                    label="enabled"
                                    position="right"
                                />
                            </div>
                        </PageContent>
                    </GlassContainer>
                </CardGrid>

                <CardGrid>
                    {(powerbuttoninfo && Object.keys(powerbuttoninfo).length > 0) && (
                        <PowerButtonObject
                            HOST_IP={HOST_IP}
                            powerbutton={powerbuttoninfo}
                        />
                    )}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add a PowerButton"
            >
                <AddPowerButton HOST_IP={HOST_IP} closeWizard={closeWizard} />
            </Wizard>
        </div>
    );
}