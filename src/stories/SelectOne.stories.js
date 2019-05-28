import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import SelectOne from "../frontend/screens/ObservationDetails/SelectOne";
import Fullscreen from "./Fullscreen";
import Header from "./Header";

class InputState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }
  render() {
    return this.props.children({
      value: this.state.value,
      onChange: value => this.setState({ value })
    });
  }
}

storiesOf("SelectOne", module)
  .addDecorator(storyFn => (
    <Fullscreen>
      <Header title="Detalles" onClosePress={action("close")} />
      {storyFn()}
    </Fullscreen>
  ))
  .add("Default", () => (
    <InputState>
      {({ value, onChange }) => (
        <SelectOne
          label="What is the scale of the spill?"
          number={1}
          hint="Select one"
          options={[
            {
              value: 5,
              label: "Under 5 meters"
            },
            {
              value: 10,
              label: "5–10 meters"
            },
            {
              value: 20,
              label: "10–20 meters"
            },
            {
              value: 30,
              label: "20–30 meters"
            },
            {
              value: 40,
              label: "30–40 meters"
            },
            {
              value: 50,
              label: "40–50 meters"
            },
            {
              value: 60,
              label: "Over 60 meters"
            }
          ]}
          value={value}
          onChange={onChange}
        />
      )}
    </InputState>
  ));
