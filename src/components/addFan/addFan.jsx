import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

const Addfan = ({ HOST_IP, closeWizard }) => {
    const [fanData, setfanData] = useState({});

    const handleConfigChange = (key, value) => {
        setfanData({
            ...fanData,
            [key]: value,
        });
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
        <div className="form-control">
            <GenericText
                label="GPIO pin"
                readOnly={false}
                type="number"
                placeholder="gpio_pin"
                value={fanData.gpio_pin}
                onChange={(e) => handleConfigChange("gpio_pin", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="PWM Frequency"
                readOnly={false}
                type="number"
                placeholder="pwm_frequency"
                value={fanData.pwm_frequency}
                onChange={(e) => handleConfigChange("pwm_frequency", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Max Temperature"
                readOnly={false}
                type="number"
                placeholder="max_temperature"
                value={fanData.max_temperature}
                onChange={(e) => handleConfigChange("max_temperature", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Min Temperature"
                readOnly={false}
                type="number"
                placeholder="min_temperature"
                value={fanData.min_temperature}
                onChange={(e) => handleConfigChange("min_temperature", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Max Speed"
                readOnly={false}
                type="number"
                placeholder="max_speed"
                value={fanData.max_speed}
                onChange={(e) => handleConfigChange("max_speed", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Min Speed"
                readOnly={false}
                type="number"
                placeholder="min_speed"
                value={fanData.min_speed}
                onChange={(e) => handleConfigChange("min_speed", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Temperature Change Threshold"
                readOnly={false}
                type="number"
                placeholder="temp_change_threshold"
                value={fanData.temp_change_threshold}
                onChange={(e) => handleConfigChange("temp_change_threshold", parseFloat(e))}
            />
        </div>

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
