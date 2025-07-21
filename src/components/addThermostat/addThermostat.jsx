import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

const AddThermostat = ({ HOST_IP, closeWizard }) => {
    const [thermostatData, setThermostatData] = useState({
        mac: "",
    });

    const handleChange = (key, value) => {
        setThermostatData({
            ...thermostatData,
            [key]: value,
        });
    };

    const handleForm = () => {
        axios
            .post(`${HOST_IP}/${thermostatData.mac}`, thermostatData)
            .then(() => {
                toast.success("Thermostat added!");
            })
            .catch((error) => {
                console.error(error);
                toast.error(`Error occurred: ${error.message}`);
            });
        closeWizard(true);
    };
    // #region HTML
    return (<>
        <div className="form-control">
            <GenericText
                label="MAC Address"
                type="text"
                placeholder="00:00:00:00:00:00"
                value={thermostatData.mac}
                onChange={(e) => handleChange("mac", e)}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Max Temperature"
                readOnly={false}
                type="number"
                placeholder="max_temperature"
                value={String(thermostatData.max_temperature)}
                onChange={(e) => handleChange("max_temperature", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Min Temperature"
                readOnly={false}
                type="number"
                placeholder="min_temperature"
                value={String(thermostatData.min_temperature)}
                onChange={(e) => handleChange("min_temperature", parseFloat(e))}
            />
        </div>

        <div className="form-control">
            <GenericButton
                value="Add Thermostat"
                color="blue"
                size=""
                type="submit"
                onClick={() => handleForm()}
            />
        </div>
    </>);
};

export default AddThermostat;
