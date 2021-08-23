/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { MAPEO_BLUE, WHITE } from "../../lib/styles";
import BottomSheet from "../../sharedComponents/BottomSheet";
import Text from "../../sharedComponents/Text";
import { DoneIcon } from "../../sharedComponents/icons";
import Circle from "../../sharedComponents/icons/Circle";
import Loading from "../../sharedComponents/Loading";
import ModalActionButtons from "./ModalActionButtons";

interface ProjectInviteDetails {
  project: {
    id: string;
    name: string;
  };
  role: string;
}

type LoadingStatus = {
  type: "loading";
};

type ErrorStatus = {
  type: "error";
  info: { error: Error };
};

type SuccessStatus = {
  type: "success";
  info: {
    inviteDetails: ProjectInviteDetails;
  };
};

const m = defineMessages({
  title: {
    id: "screens.ProjectInviteModal.title",
    defaultMessage: "Join {projectName}",
  },
  inviteMessage: {
    id: "screens.ProjectInviteModal.inviteMessage",
    defaultMessage: "You've been invited to join\n {projectName} as a {role}",
  },
  declineInvite: {
    id: "screens.ProjectInviteModal.declineInvite",
    defaultMessage: "Decline Invite",
  },
  joinAndSync: {
    id: "screens.ProjectInviteModal.joinAndSync",
    defaultMessage: "Join And Sync",
  },
  close: {
    id: "screens.ProjectInviteModal.close",
    defaultMessage: "Close",
  },
  tryAgain: {
    id: "screens.ProjectInviteModal.tryAgain",
    defaultMessage: "Try Again",
  },
  noInviteFound: {
    id: "screens.ProjectInviteModal.noInviteFound",
    defaultMessage: "No Invite Found",
  },
});

// Gregor TODO: Add method to API for decrypting invite
const getProjectInviteDetails = async (
  inviteKey: string
): Promise<ProjectInviteDetails> => {
  return new Promise((res, rej) => {
    setTimeout(
      () =>
        Math.random() > 0.5
          ? res({
              project: {
                name: `Project ${Math.floor(Math.random() * 1000)}`,
                id: "123",
              },
              role: "Project Participant",
            })
          : rej(new Error("Could not get invite details")),
      1000
    );
  });
};

const ProjectInviteModal: NavigationStackScreenComponent = ({ navigation }) => {
  const { formatMessage: t } = useIntl();
  const mountedRef = React.useRef(true);
  const sheetRef = React.useRef<BottomSheetModal>(null);

  const inviteKey: string | null = navigation.getParam("invite");

  const [status, setStatus] = React.useState<
    LoadingStatus | ErrorStatus | SuccessStatus
  >(
    inviteKey
      ? { type: "loading" }
      : { type: "error", info: { error: new Error(t(m.noInviteFound)) } }
  );

  const fetchInviteDetails = React.useCallback(async (inviteKey: string) => {
    try {
      setStatus({ type: "loading" });

      const inviteDetails = await getProjectInviteDetails(inviteKey);

      if (mountedRef.current) {
        setStatus({ type: "success", info: { inviteDetails } });
      }
    } catch (err) {
      if (mountedRef.current) {
        setStatus({ type: "error", info: { error: err } });
      }
    }
  }, []);

  const closeModal = () => {
    if (sheetRef.current) {
      sheetRef.current.dismiss();
    }
  };

  const acceptInvite = () => {
    Alert.alert(
      "Work in progress",
      "This feature has not been implemented yet",
      [
        {
          text: "Ok",
          onPress: () => closeModal(),
        },
      ]
    );
  };

  React.useEffect(() => {
    if (inviteKey) {
      fetchInviteDetails(inviteKey);
    }
  }, [fetchInviteDetails, inviteKey]);

  React.useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      onDismiss={() => {
        navigation.setParams({ invite: null });
        navigation.goBack();
      }}
      // We intentionally don't want to dismiss this modal with a back press
      onHardwareBackPress={() => {}}
    >
      {status.type === "loading" ? (
        <Loading />
      ) : status.type === "error" ? (
        <View style={styles.contentContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.title}>{status.info.error.message}</Text>
          </View>
          <ModalActionButtons
            primary={{
              onPress: () => {
                if (inviteKey) {
                  fetchInviteDetails(inviteKey);
                }
              },
              text: <FormattedMessage {...m.tryAgain} />,
            }}
            secondary={{
              onPress: closeModal,
              text: <FormattedMessage {...m.close} />,
            }}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.centeredContent}>
            <Circle radius={32} style={styles.checkmarkCircle}>
              <DoneIcon color={WHITE} size={40} />
            </Circle>
            <Text style={[styles.title, styles.bold]}>
              <FormattedMessage
                {...m.title}
                values={{ projectName: status.info.inviteDetails.project.name }}
              />
            </Text>
            <Text style={styles.description}>
              <FormattedMessage
                {...m.inviteMessage}
                values={{
                  projectName: (
                    <Text style={styles.bold}>
                      {status.info.inviteDetails.project.name}
                    </Text>
                  ),
                  role: (
                    <Text style={styles.bold}>
                      {status.info.inviteDetails.role}
                    </Text>
                  ),
                }}
              />
            </Text>
          </View>
          <ModalActionButtons
            primary={{
              onPress: acceptInvite,
              text: <FormattedMessage {...m.joinAndSync} />,
            }}
            secondary={{
              onPress: closeModal,
              text: <FormattedMessage {...m.declineInvite} />,
            }}
          />
        </View>
      )}
    </BottomSheet>
  );
};

ProjectInviteModal.navigationOptions = () => ({
  cardStyle: { backgroundColor: "transparent" },
  animationEnabled: false,
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
  },
  centeredContent: {
    alignItems: "center",
    paddingVertical: 12,
  },
  checkmarkCircle: {
    backgroundColor: MAPEO_BLUE,
    elevation: 0,
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 24,
  },
  bold: { fontWeight: "700" },
});

export default ProjectInviteModal;
