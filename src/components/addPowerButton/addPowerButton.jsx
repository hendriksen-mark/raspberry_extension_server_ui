import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { POWERBUTTON_CONFIG } from "../../Objects/powerbutton_object";

const AddPowerButton = ({ HOST_IP, closeWizard }) => {
    const [powerbuttonData, setpowerbuttonData] = useState({});

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setpowerbuttonData((prevData) => ({
                ...prevData,
                [key]: value,
            }));
            return;
        }

        if (datatype === "int") {
            value = parseInt(value, 10);
        } else if (datatype === "float") {
            value = parseFloat(value);
        }

        if (!Number.isNaN(value)) {
            setpowerbuttonData((prevData) => ({
                ...prevData,
                [key]: value,
            }));
        }
    };

    const handleForm = () => {
        axios
            .post(`${HOST_IP}/powerbutton`, powerbuttonData)
            .then(() => {
                toast.success("powerbutton added!");
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
            config={POWERBUTTON_CONFIG}
            values={powerbuttonData}
            onChange={handleConfigChange}
        />

        <div className="form-control">
            <GenericButton
                value="Add powerbutton"
                color="blue"
                size=""
                type="submit"
                onClick={() => handleForm()}
            />
        </div>
    </>);
};

export default AddPowerButton;
