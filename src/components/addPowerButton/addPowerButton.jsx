import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

const AddPowerButton = ({ HOST_IP, closeWizard }) => {
    const [powerbuttonData, setpowerbuttonData] = useState({});

    const handleConfigChange = (key, value) => {
        setpowerbuttonData({
            ...powerbuttonData,
            [key]: value,
        });
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
        <div className="form-control">
            <GenericText
                label="Button pin"
                readOnly={false}
                type="number"
                placeholder="button_pin"
                value={powerbuttonData.button_pin}
                onChange={(e) => handleConfigChange("button_pin", e)}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Long Press Duration"
                readOnly={false}
                type="number"
                placeholder="long_press_duration"
                value={powerbuttonData.long_press_duration}
                onChange={(e) => handleConfigChange("long_press_duration", e)}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Debounce Time"
                readOnly={false}
                type="number"
                placeholder="debounce_time"
                value={powerbuttonData.debounce_time}
                onChange={(e) => handleConfigChange("debounce_time", e)}
            />
        </div>

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
