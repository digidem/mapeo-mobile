import { configure, addParameters, addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

addParameters({
  viewport: {
    defaultViewport: "nexus5x"
  },
  options: {
    panelPosition: "right"
  },
  info: {
    inline: false
  }
});

addDecorator(withInfo);

function loadStories() {
  require("../src/stories/index");
  // You can require as many stories as you need.
}

configure(loadStories, module);
