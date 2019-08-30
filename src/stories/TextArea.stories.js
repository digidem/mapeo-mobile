import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import TextArea from "../frontend/screens/ObservationDetails/TextArea";
import QuestionContainer from "../frontend/screens/ObservationDetails/QuestionContainer";
import Fullscreen from "./Fullscreen";
import Header from "./Header";

class InputState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
  }
  render() {
    return this.props.children({
      value: this.state.value,
      onChange: value => this.setState({ value }),
    });
  }
}

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";

storiesOf("TextArea", module)
  .addDecorator(storyFn => (
    <Fullscreen>
      <Header title="Detalles" onClosePress={action("close")} />
      <QuestionContainer
        current={2}
        total={5}
        onNext={action("next")}
        onPrev={action("prev")}
      >
        {storyFn()}
      </QuestionContainer>
    </Fullscreen>
  ))
  .add("Default", () => (
    <InputState>
      {({ value, onChange }) => (
        <TextArea
          field={{
            label: "What additional details would you like to add?",
            placeholder: "¿Qué está pasando aquí?"
          }}
          number={3}
          value={value}
          onChange={onChange}
        />
      )}
    </InputState>
  ))
  .add("Long Answer", () => (
    <InputState initialValue={lorem}>
      {({ value, onChange }) => (
        <TextArea
          field={{
            label: "Give me a long answer?",
            placeholder: "¿Qué está pasando aquí?"
          }}
          value={value}
          onChange={onChange}
        />
      )}
    </InputState>
  ));
