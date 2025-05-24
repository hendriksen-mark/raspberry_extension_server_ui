import "./TextButton.scss";

const TextButton = ({ label, color = "blue", onClick }) => {
    return (
        <button className={`text-button ${color}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default TextButton;
