import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

import { FAN_CONFIG } from "../../Objects_Config/fan_config";

const Addfan = ({ HOST_IP, closeWizard }) => {
    const [fanData, setfanData] = useState({});

    const handleConfigChange = (key, value, datatype) => {
        if (datatype === "string") {
            setfanData((prevData) => ({
                ...prevData,
                [key]: value
            }));
            return;
        }

        if (datatype === "int") {
            value = parseInt(value, 10);
        } else if (datatype === "float") {
            value = parseFloat(value);
        }

        if (!Number.isNaN(value)) {
            setfanData((prevData) => ({
                ...prevData,
                [key]: value
            }));
        }
    };

    const handleForm = () => {
        axios
            .post(`${HOST_IP}/fan`, fanData)
            .then(() => {
                toast.success("fan added!");
            })
            .catch((error) => {
                console.error(error);
                toast.error(`Error occurred: ${error.message}`);
            });
        closeWizard(true);
    };
    // #region HTML
    return (<>
        {Object.entries(FAN_CONFIG).map(([key, config]) => (
                    <div className="form-control" key={key}>
                        <GenericText
                            label={config.label}
                            readOnly={false}
                            type={config.type}
                            placeholder={config.placeholder}
                            value={fanData[key]}
                            onChange={(e) => handleConfigChange(key, e, config.datatype)}
                        />
                    </div>
                ))}

        <div className="form-control">
            <GenericButton
                value="Add fan"
                color="blue"
                size=""
                type="submit"
                onClick={() => handleForm()}
            />
        </div>
    </>);
};

export default Addfan;
