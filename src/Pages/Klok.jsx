import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { FaClock} from "react-icons/fa";
import axios from "axios";

import CardGrid from "../components/CardGrid/CardGrid";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import KlokObject from "../components/Klok/Klok";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import AddKlok from "../components/addKlok/addKlok";
import PageContent from "../components/PageContent/PageContent";

export default function Klok({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [klokinfo, setKlokInfo] = useState(CONFIG.klok);
    const [klokConfig, setKlokConfig] = useState(CONFIG.config.klok);
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
        setKlokInfo(CONFIG.klok);
        if (!isModified) {
            setKlokConfig(CONFIG.config.klok);
        }
    }, [CONFIG]);

    const handleEnableChange = (key, value) => {
        setKlokConfig((prevConfig) => ({
            ...prevConfig,
            [key]: value
        }));
        setIsModified(true); // Mark as modified
        updateConfig(key, value);
    };

    const updateConfig = (key, value) => {
        axios
            .put(`${HOST_IP}/config`, {
                "klok": {
                    [key]: value
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`Configuration updated: ${key} = ${value}`);
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
                                    <div className="text">Klok Settings</div>
                                    {(!klokinfo || Object.keys(klokinfo).length === 0) && (
                                        <IconButton
                                            iconName={BsPlusCircle}
                                            title="Add Klok"
                                            size="small"
                                            color="green"
                                            onClick={() => openWizard()}
                                        />
                                    )}
                                </div>
                                <FlipSwitch
                                    id="enable"
                                    value={klokConfig.enabled}
                                    onChange={(e) => handleEnableChange("enable", e)}
                                    checked={klokConfig.enabled}
                                    label="Enable"
                                    position="right"
                                />
                            </div>
                        </PageContent>
                    </GlassContainer>
                </CardGrid>

                <CardGrid>
                    {(klokinfo && Object.keys(klokinfo).length > 0) && (
                        <KlokObject
                            HOST_IP={HOST_IP}
                            klok={klokinfo}
                        />
                    )}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add Klok"
            >
                <AddKlok HOST_IP={HOST_IP} closeWizard={closeWizard} />
            </Wizard>
        </div>
    );
}