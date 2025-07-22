import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";

const AddDHT = ({ HOST_IP, closeWizard }) => {
    const [dhtData, setDhtData] = useState({});

    const handleConfigChange = (key, value) => {
        setDhtData({
            ...dhtData,
            [key]: value,
        });
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
        <div className="form-control">
            <GenericText
                label="Sensor Type"
                readOnly={false}
                type="text"
                placeholder="sensor_type"
                value={dhtData.sensor_type}
                onChange={(e) => handleConfigChange("sensor_type", e)}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Sensor Pin"
                readOnly={false}
                type="number"
                placeholder="dht_pin"
                value={dhtData.dht_pin}
                onChange={(e) => handleConfigChange("dht_pin", parseInt(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Max Temperature"
                readOnly={false}
                type="number"
                placeholder="max_temperature"
                value={dhtData.MAX_DHT_TEMP}
                onChange={(e) => handleConfigChange("MAX_DHT_TEMP", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Min Temperature"
                readOnly={false}
                type="number"
                placeholder="min_temperature"
                value={dhtData.MIN_DHT_TEMP}
                onChange={(e) => handleConfigChange("MIN_DHT_TEMP", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Max Humidity"
                readOnly={false}
                type="number"
                placeholder="MAX_HUMIDITY"
                value={dhtData.MAX_HUMIDITY}
                onChange={(e) => handleConfigChange("MAX_HUMIDITY", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Min Humidity"
                readOnly={false}
                type="number"
                placeholder="MIN_HUMIDITY"
                value={dhtData.MIN_HUMIDITY}
                onChange={(e) => handleConfigChange("MIN_HUMIDITY", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Temperature Change Threshold"
                readOnly={false}
                type="number"
                placeholder="TEMP_CHANGE_THRESHOLD"
                value={dhtData.DHT_TEMP_CHANGE_THRESHOLD}
                onChange={(e) => handleConfigChange("DHT_TEMP_CHANGE_THRESHOLD", parseFloat(e))}
            />
        </div>
        <div className="form-control">
            <GenericText
                label="Humidity Change Threshold"
                readOnly={false}
                type="number"
                placeholder="HUMIDITY_CHANGE_THRESHOLD"
                value={dhtData.DHT_HUMIDITY_CHANGE_THRESHOLD}
                onChange={(e) => handleConfigChange("DHT_HUMIDITY_CHANGE_THRESHOLD", parseFloat(e))}
            />
        </div>

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
