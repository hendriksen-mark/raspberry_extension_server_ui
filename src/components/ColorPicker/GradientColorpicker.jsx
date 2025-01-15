import React, { useRef, useEffect, useState } from "react";
import iro from "@jaames/iro";
import axios from "axios";
import { rgbToCie } from "../ColorFormatConverter/ColorFormatConverter";
import './gradientColorpicker.scss';

export default function GradientColorpicker({ HOST_IP, API_KEY, light }) {
  const pickerRef = useRef(null);
  const picker = useRef(null);
  const [gradientStyle, setGradientStyle] = useState({});

  useEffect(() => {
    if (!light) {
      //console.log("No light selected");
      return;
    }

    const interpolateColor = (color1, color2, factor) => {
      //console.log("Interpolating colors", color1, color2, factor);
      const result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
        return Math.round(parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(hex, 16)));
      });
      return `#${result.map(value => value.toString(16).padStart(2, '0')).join('')}`;
    };

    const onChange = () => {
      //console.log("change light:", light);
      const colors = picker.current.colors.map(color => color.hexString);
      const interpolatedColors = [
        colors[0],
        interpolateColor(colors[0], colors[1], 0.5),
        colors[1],
        interpolateColor(colors[1], colors[2], 0.5),
        colors[2]
      ];
      const gradient = {
        colors: interpolatedColors,
      };
      //console.log(gradient);
      const activeColor = picker.current.color.hexString;
      const activeColorIndex = picker.current.colors.findIndex(color => color.hexString === activeColor);
      //console.log("Active color:", activeColor, "at position:", activeColorIndex);

      // Convert hex colors to RGB
      const rgbColors = interpolatedColors.map(hex => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255
        };
      });

      // Convert RGB to xy
      const xyColors = rgbColors.map(rgb => rgbToCie(rgb.r, rgb.g, rgb.b));

      // Make a single axios PUT request
      axios.put(
        `${HOST_IP}/api/${API_KEY}/lights/${light}/state`,
        {
          gradient: {
            points: xyColors.map(xy => ({ color: { xy: { x: xy[0], y: xy[1] } } }))
          }
        }
      );

      // Update gradient style
      setGradientStyle({
        background: `linear-gradient(to right, ${interpolatedColors.join(', ')})`,
      });
    };

    if (pickerRef.current) {
      if (picker.current) {
        picker.current.off("input:end", onChange);
        picker.current = null;
        pickerRef.current.innerHTML = ""; // Clear the previous color picker instance
      }
      picker.current = new iro.ColorPicker(pickerRef.current, {
        layout: [
          {
            component: iro.ui.Wheel,
            options: {},
          },
        ],
        colors: ["#f00", "#0f0", "#00f"], // Initial colors for the handles
      });
      picker.current.on("input:end", onChange, { passive: true });
    }
  }, [HOST_IP, API_KEY, light]);

  return (
    <div>
      <div ref={pickerRef}></div>
      <div className="gradientDisplay" style={{  ...gradientStyle }}></div>
    </div>
  );
}
