export const THERMOSTAT_INFO_CONFIG = {
    mac: {
        label: "MAC Address",
        type: "text",
        placeholder: "mac",
    },
    last_updated: {
        label: "Last Updated",
        type: "text",
        placeholder: "last_updated",
        transformValue: (thermostat) => thermostat?.last_updated?.toLocaleString(),
    },
    first_seen: {
        label: "First Seen",
        type: "text",
        placeholder: "first_seen",
        transformValue: (thermostat) => thermostat?.first_seen?.toLocaleString(),
    },
    DHT_connected: {
        label: "DHT Sensor",
        type: "text",
        placeholder: "DHT Sensor",
        transformValue: (thermostat) => (thermostat?.DHT_connected ? "Connected" : "Disconnected"),
    },
};

export const THERMOSTAT_CONFIG = {
    mac: {
        label: "MAC Address",
        type: "text",
        placeholder: "00:00:00:00:00:00",
        datatype: "string",
    },
    max_temperature: {
        label: "Max Temperature",
        type: "number",
        placeholder: "max_temperature",
        datatype: "float",
    },
    min_temperature: {
        label: "Min Temperature",
        type: "number",
        placeholder: "min_temperature",
        datatype: "float",
    },
};
