import GenericText from "../GenericText/GenericText";

const ConfigFieldGroup = ({
    config,
    values,
    readOnly = false,
    onChange = undefined,
}) => {
    return (
        <>
            {Object.entries(config).map(([key, field]) => {
                const fieldValue = field.transformValue
                    ? field.transformValue(values)
                    : values?.[key] ?? "";

                return (
                    <div className="form-control" key={key}>
                        <GenericText
                            label={field.label}
                            readOnly={readOnly}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={fieldValue}
                            onChange={onChange ? (value) => onChange(key, value, field) : undefined}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default ConfigFieldGroup;
