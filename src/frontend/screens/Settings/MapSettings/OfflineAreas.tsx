import * as React from "react";
import { ScrollView } from "react-native";

interface OfflineAreaProps {
  BGMapID: string;
}

interface SingleOfflineArea {}

export const OfflineAreas = ({ BGMapID }: OfflineAreaProps) => {
  const [offlineAreas, setOfflineAreas] = React.useState();

  React.useEffect(() => {
    //Get offline areas here
  }, []);

  return <ScrollView></ScrollView>;
};
