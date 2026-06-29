import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import ConfigFieldGroup from "../ConfigFieldGroup/ConfigFieldGroup";

import { KLOK_CONFIG } from "../../Objects_Config/klok_config";

const AddKlok = ({ HOST_IP, closeWizard }) => {
    const [KlokData, setKlokData] = useState({});

    const handleConfigChange = (key, value) => {
        const parsedValue = parseInt(value, 10);
        if (!Number.isNaN(parsedValue)) {
            setKlokData((prevData) => ({
                ...prevData,
                [key]: parsedValue,
            }));
        }
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
        <ConfigFieldGroup
            config={KLOK_CONFIG}
            values={KlokData}
            onChange={(key, value) => handleConfigChange(key, value)}
        />

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
