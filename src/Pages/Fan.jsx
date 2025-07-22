import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { FaClock} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import FanObject from "../components/Fan/Fan";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import AddFan from "../components/addFan/addFan";
import PageContent from "../components/PageContent/PageContent";
import GenericText from "../components/GenericText/GenericText";

export default function fan({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [faninfo, setfanInfo] = useState(CONFIG.fan);
    const [fanConfig, setfanConfig] = useState(CONFIG.config.fan);
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
        setfanInfo(CONFIG.fan);
        if (!isModified) {
            setfanConfig(CONFIG.config.fan);
        }
    }, [CONFIG]);

    const handleEnableChange = (key, value) => {
        setfanConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
        updateConfig(key, value);
    };

    const handleIntervalChange = (e) => {
        const value = parseInt(e, 10);
        if (!isNaN(value)) {
            setfanConfig((prevConfig) => ({
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
                "fan": {
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
                                    <div className="text">Fan Settings</div>
                                    {(!faninfo || Object.keys(faninfo).length === 0) && (
                                        <IconButton
                                            iconName={BsPlusCircle}
                                            title="Add Fan"
                                            size="small"
                                            color="green"
                                            onClick={() => openWizard()}
                                        />
                                    )}
                                </div>
                                <FlipSwitch
                                    id="enabled"
                                    value={fanConfig.enabled}
                                    onChange={(e) => handleEnableChange("enabled", e)}
                                    checked={fanConfig.enabled}
                                    label="enabled"
                                    position="right"
                                />
                                <GenericText
                                    label="Interval"
                                    readOnly={false}
                                    type="number"
                                    placeholder="interval"
                                    value={String(fanConfig.interval)}
                                    onChange={(e) => handleIntervalChange(e)}
                                />
                            </div>
                        </PageContent>
                    </GlassContainer>
                </CardGrid>

                <CardGrid>
                    {(faninfo && Object.keys(faninfo).length > 0) && (
                        <FanObject
                            HOST_IP={HOST_IP}
                            fan={faninfo}
                        />
                    )}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add a Fan"
            >
                <AddFan HOST_IP={HOST_IP} closeWizard={closeWizard} />
            </Wizard>
        </div>
    );
}