import { motion } from "framer-motion";
import { useState } from "react";

import "./brightnessSlider.scss";

const BrightnessSlider = ({ defaultValue, onChange, max = 254, min = 0, step = 1 }) => {
  const [value, setValue] = useState(Math.round(defaultValue));

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
  };

  const handleDragEnd = () => {
        onChange(value);
    };
  // #region HTML
  return (
    <motion.div
      className="sliderContainer"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: {
          opacity: 1,
          height: 25,
        },
        collapsed: {
          opacity: 0,
          height: 0,
        },
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        className="slider"
        onChange={(e) => {
          handleChange(e);
        }}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
      />
      <div className="sliderValue">{value}</div>
    </motion.div>
  );
};

export default BrightnessSlider;
