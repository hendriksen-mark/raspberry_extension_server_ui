import { useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import { toast } from "react-hot-toast";

import BrightnessSlider from "../BrightnessSlider/BrightnessSlider";
import CustomTimePicker from "../TimePicker/Timepicker";
import GenericButton from "../GenericButton/GenericButton";
import GenericText from "../GenericText/GenericText";
import SelectMenu from "../SelectMenu/SelectMenu";

const Edit_behavior = ({ HOST_IP, API_KEY, Behavior_item, closeWizard }) => {
  const [behaviorData, setBehaviorData] = useState({
    script_id: Behavior_item["script_id"],
    Name: Behavior_item["metadata"]["name"],
    hour: Behavior_item["configuration"]["when"]["time_point"]["time"]["hour"],
    minute: Behavior_item["configuration"]["when"]["time_point"]["time"]["minute"],
    recurrence_days: Behavior_item["configuration"]["when"]["recurrence_days"],
    fade_in_duration: Behavior_item["configuration"]["fade_in_duration"]["seconds"],
    turn_lights_off_after: Behavior_item["configuration"]["turn_lights_off_after"]["seconds"],
    end_brightness: Behavior_item["configuration"]["end_brightness"],
  });

  const [initialTime, setValue] = useState(dayjs().hour(behaviorData.hour).minute(behaviorData.minute));
  const [fadeInTime, setFadeInTime] = useState(dayjs().hour(0).minute(behaviorData.fade_in_duration / 60));
  const [turnOffTime, setTurnOffTime] = useState(dayjs().hour(0).minute(behaviorData.turn_lights_off_after / 60));

  const handleChange = (key, value) => {
    setBehaviorData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    console.log([key] + ": " + value);
  };

  const handleSave = () => {
    const updatedBehavior = {
      ...Behavior_item,
      metadata: { name: behaviorData.Name },
      configuration: {
        ...Behavior_item.configuration,
        when: {
          ...Behavior_item.configuration.when,
          time_point: {
            ...Behavior_item.configuration.when.time_point,
            time: {
              hour: behaviorData.hour,
              minute: behaviorData.minute,
            },
          },
          recurrence_days: behaviorData.recurrence_days,
        },
        fade_in_duration: { seconds: behaviorData.fade_in_duration },
        turn_lights_off_after: { seconds: behaviorData.turn_lights_off_after },
        end_brightness: behaviorData.end_brightness,
      },
    };

    axios
      .put(`${HOST_IP}/clip/v2/resource/behavior_instance/${Behavior_item.id}`, updatedBehavior, {
        headers: {
          "hue-application-key": API_KEY,
        },
      })
      .then((response) => {
        console.log("Behavior updated:", response.data);
        toast.success("Behavior updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
      closeWizard(true);
  };

  const days = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const selectedDays = behaviorData.recurrence_days ? behaviorData.recurrence_days.map(day => days.find(d => d.value === day)) : [];

  return (
    <>
      <div className="form-control">
        <div className="form-control">
          <GenericText
            label="Name"
            type="text"
            placeholder="Name of Automation"
            value={behaviorData.Name}
            onChange={(e) => handleChange("Name", e)}
          />
        </div>
        <div className="form-control">
          <CustomTimePicker
            label="End Time"
            value={initialTime}
            onChange={(newValue) => {
              handleChange("hour", newValue.hour());
              handleChange("minute", newValue.minute());
            }}
          />
        </div>
        <div className="form-control">
          <CustomTimePicker
            label="Fade In Duration (time before end time)"
            value={fadeInTime}
            onChange={(newValue) => {
              handleChange("fade_in_duration", newValue.hour() * 3600 + newValue.minute() * 60);
              setFadeInTime(newValue);
            }}
          />
        </div>
        <div className="form-control">
          <CustomTimePicker
            label="Turn Lights Off After (time after end time)"
            value={turnOffTime}
            onChange={(newValue) => {
              handleChange("turn_lights_off_after", newValue.hour() * 3600 + newValue.minute() * 60);
              setTurnOffTime(newValue);
            }}
          />
        </div>
        <div className="form-control">
          <label>End Brightness (%)</label>
          <BrightnessSlider
            defaultValue={behaviorData.end_brightness}
            max = "100"
            onChange={(value) => handleChange("end_brightness", value)}
          />
        </div>
        <div className="form-control">
          <SelectMenu
            label="Recurrence Days"
            options={days}
            defaultValue={selectedDays}
            onChange={(e) => handleChange("recurrence_days", e)}
            close={false}
            multie={true}
            classOptions="maxWidth"
          />
        </div>
        <div className="form-control">
          <GenericButton
          value="Save"
          color="blue"
          size=""
          onClick={() => handleSave()}
          />
        </div>
      </div>
    </>
  );
};

export default Edit_behavior;
