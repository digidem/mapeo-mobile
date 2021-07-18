import { Text } from "@react-native-community/art";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View } from "react-native";

const m = defineMessages({
  projectDeleted: {
    id: "screens.LeaveProject.LeaveProjectProgress.projectDeleted",
    defaultMessage: "Project Deleted",
  },
});

export const LeaveProjectCompleted = () => {
  return (
    <View>
      <Text>
        <FormattedMessage {...m.projectDeleted} />
      </Text>
    </View>
  );
};
