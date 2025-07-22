import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

const AddKlok = ({ HOST_IP, closeWizard }) => {
    const [KlokData, setKlokData] = useState({});

    const handleConfigChange = (key, value) => {
        setKlokData({
            ...KlokData,
            [key]: value,
        });
    };

    const handleForm = () => {
        axios
            .post(`${HOST_IP}/klok`, KlokData)
            .then(() => {
                toast.success("Klok added!");
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
                label="CLK pin"
                readOnly={false}
                type="number"
                placeholder="clk_pin"
                value={KlokData.CLK_pin}
                onChange={(e) => handleConfigChange("CLK_pin", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="DIO Pin"
                readOnly={false}
                type="number"
                placeholder="DIO_pin"
                value={KlokData.DIO_pin}
                onChange={(e) => handleConfigChange("DIO_pin", parseInt(e))}
            />
        </div>

        <div className="form-control">
            <GenericButton
                value="Add Klok"
                color="blue"
                size=""
                type="submit"
                onClick={() => handleForm()}
            />
        </div>
    </>);
};

export default AddKlok;
