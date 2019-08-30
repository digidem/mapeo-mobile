// @flow
import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import ObservationEditView from "../frontend/screens/ObservationEdit/ObservationEditView";
import DraftObservationContext from "../frontend/context/DraftObservationContext";
import Fullscreen from "./Fullscreen";
import Header from "./Header";

storiesOf("ObservationEdit", module)
  .addDecorator(storyFn => (
    <DraftObservationContext.Provider>
      <Fullscreen>
        <Header title="Create Observation" onClosePress={action("close")} />
        {storyFn()}
      </Fullscreen>
    </DraftObservationContext.Provider>
  ))
  .add("New Observation", () => (
    <ObservationEditView
      isFocused
      isNew
      onPressDetails={action("add details")}
      onPressPhoto={action("press photo")}
      onPressCategory={action("choose category")}
      onPressCamera={action("open camera")}
    />
  ));
