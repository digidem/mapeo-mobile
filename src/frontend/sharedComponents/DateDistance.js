// @flow
import React from "react";
import { Text } from "react-native";
import { FormattedRelativeTime, FormattedDate } from "react-intl";
import { useAppState } from "react-native-hooks";

import type { Style } from "../types";

type Props = {
  date: Date,
  style?: Style<typeof Text>
};

// We use relative dates for anything within the last 7 days, and then absolute
// dates for anything else.
const USE_WORDS_WITHIN_SECONDS = 4 * 24 * 60 * 60; // 4 days

const DateDistance = ({ date = new Date(), style }: Props) => {
  // Round distance to nearest 10 seconds
  const distanceInSeconds = Math.floor((Date.now() - date) / 10000) * 10;
  const currentAppState = useAppState();

  return (
    <Text style={style}>
      {distanceInSeconds <= USE_WORDS_WITHIN_SECONDS &&
      currentAppState === "active" ? (
        <FormattedRelativeTime
          value={-distanceInSeconds}
          numeric="auto"
          updateIntervalInSeconds={10}
        />
      ) : (
        <FormattedDate value={date} format="long" />
      )}
    </Text>
  );
};

export default DateDistance;
