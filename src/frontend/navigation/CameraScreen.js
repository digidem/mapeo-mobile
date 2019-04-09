// @flow
import React from "react";

import CameraView from "../components/CameraView";
import type { DraftObservationContext } from "../context/DraftObservationContext";

type Props = {
  createObservation: $ElementType<DraftObservationContext, "addPhoto">
};

const CameraScreen = ({ createObservation }: Props) => (
  <CameraView addPhoto={createObservation} />
);

export default CameraScreen;
