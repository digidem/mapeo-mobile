import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import QuestionNavBar from "../frontend/screens/ObservationDetails/QuestionNavBar";
import Fullscreen from "./Fullscreen";

storiesOf("QuestionNavBar", module)
  .addDecorator(storyFn => (
    <Fullscreen style={screenStyle}>{storyFn()}</Fullscreen>
  ))
  .add("Default", () => (
    <QuestionNavBar
      current={1}
      total={5}
      onNext={action("next")}
      onPrev={action("prev")}
    />
  ));

const screenStyle = {
  backgroundColor: "#F6F6F6",
  flexDirection: "column",
  justifyContent: "center",
  flex: 1
};
