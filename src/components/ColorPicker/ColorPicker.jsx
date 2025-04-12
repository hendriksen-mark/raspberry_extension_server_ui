import React, { useRef, useEffect } from "react";

import axios from "axios";
import iro from "@jaames/iro";

import { cieToRgb, rgbToCie, } from "../ColorFormatConverter/ColorFormatConverter";

import "./colorPicker.scss";

export default function KelvinPicker({
  HOST_IP,
  api_key,
  lights,
  groupLights,
}) {
  const pickerRef = useRef(null);
  const picker = useRef(null);

  useEffect(() => {
    const onChange = (newState) => {
      let rgb = newState.rgb;

      //console.log(newState.rgb);
      //console.log("Apply state " + JSON.stringify(newState));
      axios.put(
        `${HOST_IP}/api/${api_key}/lights/${
          groupLights[newState["index"]]
        }/state`,
        { xy: rgbToCie(rgb["r"], rgb["g"], rgb["b"]) }
      );
    };

    let colors = [];
    for (var light of groupLights.entries()) {
      light = light[1];
      if ("xy" in lights[light]["state"]) {
        const [x, y] = lights[light]["state"]["xy"];
        if (x === 0.0 && y === 0.0) {
          colors.push({ r: 255, g: 255, b: 255 }); // Default to white if xy is [0.0, 0.0]
        } else {
          colors.push(cieToRgb(x, y, 254));
        }
      }
    }

    if (pickerRef.current && !picker.current) {
      picker.current = new iro.ColorPicker(pickerRef.current, {
        layout: [
          {
            component: iro.ui.Wheel,
            options: {},
          },
        ],
        colors: colors,
      });
      //console.log(picker.current.state.color.rgb)
      picker.current.on("input:end", onChange);
    }
  }, [groupLights, lights, HOST_IP, api_key]);
  return <div ref={pickerRef}></div>;
}
