import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { DHT_CONFIG } from "../../Objects/dht_object";

const AddDHT = ({ HOST_IP, closeWizard }) => {
    const [dhtData, setDhtData] = useState({});

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setDhtData((prevData) => ({
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
            setDhtData((prevData) => ({
                ...prevData,
                [key]: value,
            }));
        }
    };

    const handleForm = () => {
        axios
            .post(`${HOST_IP}/dht`, dhtData)
            .then(() => {
                toast.success("DHT Sensor added!");
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
            config={DHT_CONFIG}
            values={dhtData}
            onChange={handleConfigChange}
        />

        <div className="form-control">
            <GenericButton
                value="Add DHT Sensor"
                color="blue"
                size=""
                type="submit"
                onClick={() => handleForm()}
            />
        </div>
    </>);
};

export default AddDHT;
