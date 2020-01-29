import React from "react";
import Pager from "./Pager";
import { useNavigation } from "react-navigation-hooks";

const Intro = () => {
  const { navigate } = useNavigation();
  return <Pager onPressComplete={() => navigate("App")} />;
};

export default Intro;
