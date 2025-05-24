import "./genericText.scss";

const GenericText = ({ label = '', value = '', placeholder = '', readOnly = false, type = 'text', onChange = undefined, pattern = '', autoComplete = 'off' }) => {
    return (<>
        <label htmlFor={label}>{label}</label>
        <input
            id={label}
            readOnly={readOnly}
            type={type}
            pattern={pattern}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            autoComplete={autoComplete}
        />
    </>);
};

const GenericTextArea = ({ label = '', value = '', placeholder = '', readOnly = false, type = 'text', onChange = undefined, pattern = '', autoComplete = 'off', rows='', cols='', inputRef = null }) => {
    return (<>
        <label htmlFor={label}>{label}</label>
        <textarea
            id={label}
            readOnly={readOnly}
            type={type}
            pattern={pattern}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            rows={rows}
            cols={cols}
            autoComplete={autoComplete}
            ref={inputRef}
        />
    </>);
};

export default GenericText;
export { GenericText, GenericTextArea };