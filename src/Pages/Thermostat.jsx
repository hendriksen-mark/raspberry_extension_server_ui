import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";

import CardGrid from "../components/CardGrid/CardGrid";
import Thermostat from "../components/Thermostat/Thermostat";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";

export default function Thermostats({ HOST_IP, CONFIG }) {
    const [WizardIsOpen, setWizardIsOpen] = useState(false);
    const [thermostats, setThermostats] = useState(CONFIG.thermostats);

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
        setThermostats(CONFIG.thermostats);
    }, [CONFIG]);
    // #region HTML
    return (
        <div className="content">
            <div className="inner">
                <CardGrid>
                    <IconButton
                        iconName={BsPlusCircle}
                        title="Add light"
                        size="big"
                        color="btn"
                        label="Add light"
                        onClick={() => openWizard()}
                    />
                </CardGrid>

                <CardGrid>
                    {Object.entries(thermostats).map(([id, thermostatconfig]) => (
                        <Thermostat
                            key={id}
                            HOST_IP={HOST_IP}
                            id={id}
                            thermostat={thermostatconfig}
                        />
                    ))}
                </CardGrid>
            </div>

            <Wizard
                isOpen={WizardIsOpen}
                closeWizard={() => closeWizard(false)}
                headline="Add Light"
            >
            </Wizard>
        </div>
    );
}