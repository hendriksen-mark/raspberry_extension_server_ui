import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import GradientColorpicker from "../ColorPicker/GradientColorpicker.jsx";
import SelectMenu from "../SelectMenu/SelectMenu";

const GradientpickerSection = ({
  showContainer,
  gradientLights,
  HOST_IP,
  api_key,
}) => {
  //console.log("GradientpickerSection", gradientLights);
  const [selectedLight, setSelectedLight] = useState(gradientLights.length > 0 ? gradientLights[0].value : "");

  useEffect(() => {
    //console.log("Selected light state updated:", selectedLight);
  }, [selectedLight]);

  const handleChange = (selectedOption) => {
    //console.log("Selected light", selectedOption.value);
    setSelectedLight(selectedOption.value);
  };

  return (
    <motion.div className="row colorpicker">
      <AnimatePresence initial={false} mode="wait">
        {showContainer === "gradient" && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: {
                opacity: 1,
                scale: 1,
                height: "auto",
              },
              collapsed: {
                opacity: 0,
                scale: 0.5,
                height: 0,
              },
            }}
            transition={{
              duration: 0.2,
            }}
          >

            <SelectMenu
                value={gradientLights.find(option => option.value === selectedLight)}
                options={gradientLights}
                onChange={handleChange}
            />
            <br />
            <GradientColorpicker
                HOST_IP={HOST_IP}
                API_KEY={api_key}
                light={selectedLight}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>);

};

export default GradientpickerSection;

