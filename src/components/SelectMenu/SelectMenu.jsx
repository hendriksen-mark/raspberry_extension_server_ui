import Select from "react-select";
import "./selectMenu.scss";

const SelectMenu = ({ label, defaultValue, placeholder, options, onChange, close = true , multie = false, classOptions = ""}) => {
    return (
        <div className={`dropdown ${classOptions}`}>
            <label>{label}</label>
            <Select
                closeMenuOnSelect={close}
                defaultValue={defaultValue}
                isMulti={multie}
                options={options}
                placeholder={placeholder}
                onChange={(e) => {
                    //console.log("SelectMenu onChange event:", e);
                    onChange(e);
                }}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
            />
        </div>);
};
export default SelectMenu;