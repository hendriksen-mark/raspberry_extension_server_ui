import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { THERMOSTAT_CONFIG } from "../../Objects/thermostat_object";

const AddThermostat = ({ HOST_IP, closeWizard }) => {
    const [thermostatData, setThermostatData] = useState({});

    const handleChange = (key, value, field) => {
        if (field.datatype === "string") {
            setThermostatData((prevData) => ({
                ...prevData,
                [key]: value,
            }));
            return;
        }

        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
            setThermostatData((prevData) => ({
                ...prevData,
                [key]: parsedValue,
            }));
        }
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
        <ConfigFieldGroup
            config={THERMOSTAT_CONFIG}
            values={thermostatData}
            onChange={handleChange}
        />

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
