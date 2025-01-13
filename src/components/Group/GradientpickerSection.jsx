import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import GradientColorpicker from "../ColorPicker/GradientColorpicker.jsx";
import SelectMenu from "../SelectMenu/SelectMenu";

const GradientpickerSection = ({
  showContainer,
  gradientLights,
  HOST_IP,
  api_key,
}) => {
    const [selectedLight, setSelectedLight] = useState(null);
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
                options={gradientLights}
                onChange={setSelectedLight}
                value={selectedLight}
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

