import React, { useState } from "react";

import GenericSwitch from "../components/POC/GenericSwitch";
import HueSwitch from "../components/POC/HueSwitch";
import Wizard from "../components/Wizard/Wizard";
import SelectMenu from "../components/SelectMenu/SelectMenu";

import GradientColorpicker from "../components/ColorPicker/GradientColorpicker";

export default function Testpage({ HOST_IP, API_KEY, CONFIG }) {
  const lights = CONFIG.lights;
  const [WizardIsOpen, setWizardIsOpen] = useState(false);
  const [selectedLight, setSelectedLight] = useState(null);

  const openWizard = () => {
    setWizardIsOpen(true);
  };

  const closeWizard = () => {
    setWizardIsOpen(false);
  };

  const lightOptions = Object.keys(lights).map(key => ({
    value: key,
    label: lights[key].name
  }));
// #region HTML
  return (
    <div className="inner">
      <SelectMenu
        options={lightOptions}
        onChange={setSelectedLight}
        value={selectedLight}
      />
      <GradientColorpicker
        HOST_IP={HOST_IP}
        API_KEY={API_KEY}
        selectedLight={selectedLight}
      />

      <GenericSwitch />
      <HueSwitch />

      <div>
        <button onClick={openWizard}>Open Wizard</button>
        <Wizard isOpen={WizardIsOpen} closeWizard={closeWizard}>
          <p>Test Text</p>
        </Wizard>
      </div>
    </div>
  );
}
