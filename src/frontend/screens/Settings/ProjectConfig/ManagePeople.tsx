/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { FormattedMessage, defineMessages } from "react-intl";

import { MAPEO_BLUE } from "../../../lib/styles";
import { showWipAlert } from "../../../lib/utils";
import Button from "../../../sharedComponents/Button";
import Text from "../../../sharedComponents/Text";

import { MemberRow } from "./MemberRow";
import { useNavigationFromRoot } from "../../../hooks/useNavigationWithTypes";

const m = defineMessages({
  managePeople: {
    id: "screens.Settings.ManagePeople.managePeople",
    defaultMessage: "Manage People",
  },
  add: {
    id: "screens.Settings.ManagePeople.add",
    defaultMessage: "Add",
  },
  leaveProject: {
    id: "screens.Settings.ManagePeople.leaveProject",
    defaultMessage: "Leave Project",
  },
  remove: {
    id: "screens.Settings.ManagePeople.remove",
    defaultMessage: "Remove",
  },
  yourDevice: {
    id: "screens.Settings.ManagePeople.yourDevice",
    defaultMessage: "(You) {deviceName}",
    description:
      "Row label indicating details related to the user's device membership",
  },
});

interface MemberDevice {
  id: string;
  name: string;
}

interface Props {
  loading: boolean;
}

export const ManagePeople = ({ loading }: Props) => {
  const navigation = useNavigationFromRoot();

  // TODO: dummy state
  const [members] = React.useState<MemberDevice[]>([
    { id: "1", name: "Android Device Example A" },
    { id: "2", name: "Android Device Example B" },
    { id: "3", name: "Android Device Example C" },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          <FormattedMessage {...m.managePeople} />
        </Text>
        <Button
          variant="outlined"
          disabled={loading}
          onPress={() => navigation.navigate("AddToProjectScreen")}
        >
          <View style={styles.addButtonContainer}>
            <MaterialIcon
              name="person-add"
              color={MAPEO_BLUE}
              size={24}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.addButtonText}>
              <FormattedMessage {...m.add} />
            </Text>
          </View>
        </Button>
      </View>
      <View>
        <MemberRow
          buttonText={
            <Text style={[styles.memberRowText, { color: MAPEO_BLUE }]}>
              <FormattedMessage {...m.leaveProject} />
            </Text>
          }
          onButtonPress={
            loading ? () => {} : () => navigation.navigate("LeaveProjectScreen")
          }
        >
          <Text style={styles.memberRowText}>
            <FormattedMessage
              {...m.yourDevice}
              values={{
                deviceName:
                  "Android " + getUniqueId().slice(0, 4).toUpperCase(),
              }}
            />
          </Text>
        </MemberRow>
        {members.map(({ id, name }, index) => (
          <MemberRow
            key={id}
            addTopBorder={index <= members.length - 1}
            buttonText={
              <Text style={[styles.memberRowText, { color: MAPEO_BLUE }]}>
                <FormattedMessage {...m.remove} />
              </Text>
            }
            onButtonPress={loading ? () => {} : showWipAlert}
          >
            <Text style={styles.memberRowText} numberOfLines={1}>
              {name}
            </Text>
          </MemberRow>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontWeight: "700",
    color: MAPEO_BLUE,
    fontSize: 18,
  },
  memberRow: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberRowText: {
    fontSize: 18,
    flexShrink: 1,
  },
});
