import React from "react";

import { FaPalette, FaImages, FaLightbulb } from "react-icons/fa";
import { MdInvertColors, MdGradient } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@mui/material";

const ButtonRow = ({
  showContainer,
  setShowContainer,
  lightsCapabilities,
  setSceneModal,
}) => {
  const barIconVariants = {
    opened: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    },
  };

  return (
      <AnimatePresence mode="wait">
        {showContainer !== "closed" && (
          <motion.div
            key="buttons"
            className="row buttons"
            initial="closed"
            animate="opened"
            exit="closed"
            variants={barIconVariants}
            transition={{
              duration: 0.2,
            }}
          >
            {lightsCapabilities.includes("gradient") && (
              <motion.div
                className={`btn ${showContainer === "gradient" ? "active" : ""}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip
                  title={<p style={{ fontSize: "18px" }}>{"Gradient"}</p>}
                  arrow
                >
                  <div>
                    <MdGradient onClick={() => setShowContainer("gradient")} />
                  </div>
                </Tooltip>
              </motion.div>
            )}

            {lightsCapabilities.includes("xy") && (
              <motion.div
                className={`btn ${showContainer === "colorPicker" ? "active" : ""}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip
                  title={<p style={{ fontSize: "18px" }}>{"ColorPicker"}</p>}
                  arrow
                >
                  <div>
                    <FaPalette onClick={() => setShowContainer("colorPicker")} />
                  </div>
                </Tooltip>
              </motion.div>
            )}

            {lightsCapabilities.includes("ct") && (
              <motion.div
                className={`btn ${showContainer === "colorTempPicker" ? "active" : ""}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip
                  title={<p style={{ fontSize: "18px" }}>{"ColorTempPicker"}</p>}
                  arrow
                >
                  <div>
                    <MdInvertColors onClick={() => setShowContainer("colorTempPicker")} />
                  </div>
                </Tooltip>
              </motion.div>
            )}

            <motion.div
              className={"btn"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Scenes"}</p>}
                arrow
              >
                <div>
                  <FaImages onClick={() => setSceneModal(true)} />
                </div>
              </Tooltip>
            </motion.div>

            <motion.div
              className={`btn ${showContainer === "lights" ? "active" : ""}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip
                title={<p style={{ fontSize: "18px" }}>{"Lights"}</p>}
                arrow
              >
                <div>
                  <FaLightbulb onClick={() => setShowContainer("lights")} />
                </div>
              </Tooltip>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default ButtonRow;
