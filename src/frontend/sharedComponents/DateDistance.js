// @flow
import React from "react";
import Text from "./Text";
import { FormattedRelativeTime, FormattedDate } from "react-intl";
import { useAppState } from "@react-native-community/hooks";

import type { TextStyleProp } from "../types";

type Props = {
  date: Date,
  style?: TextStyleProp,
};

// We use relative dates for anything within the last 7 days, and then absolute
// dates for anything else.
const USE_WORDS_WITHIN_SECONDS = 4 * 24 * 60 * 60; // 4 days
const MINUTE = 60;
const HOUR = 60 * 60;
const DAY = 60 * 60 * 24;

const DateDistance = ({ date = new Date(), style }: Props) => {
  // Round distance to nearest 10 seconds
  const distanceInSeconds = Math.floor((Date.now() - date) / 10000) * 10;
  const currentAppState = useAppState();

  const absValue = Math.abs(distanceInSeconds);
  let node;
  if (absValue > USE_WORDS_WITHIN_SECONDS || currentAppState !== "active") {
    // Don't use relative time when app is in the background, since we don't
    // want to have updates happening in the background
    node = <FormattedDate value={date} format="long" />;
  } else if (absValue < MINUTE) {
    node = (
      <FormattedRelativeTime
        value={-distanceInSeconds}
        numeric="auto"
        updateIntervalInSeconds={5}
      />
    );
  } else if (absValue < HOUR) {
    // After a minute is passed, no need to update every 5 seconds (perf.)
    node = (
      <FormattedRelativeTime
        value={-Math.round(distanceInSeconds / MINUTE)}
        unit="minute"
        updateIntervalInSeconds={30}
      />
    );
  } else if (absValue < DAY) {
    // setting updateIntervalInSeconds would format this correctly, but causes
    // long timeouts to be set (to update after a day) which react-native /
    // mobile does not like. Therefore we don't try to update these (assumption
    // is that users will not look at this screen for a day)
    node = (
      <FormattedRelativeTime
        value={-Math.round(distanceInSeconds / HOUR)}
        unit="hour"
      />
    );
  } else {
    node = (
      <FormattedRelativeTime
        value={-Math.round(distanceInSeconds / DAY)}
        unit="day"
      />
    );
  }

  return <Text style={style}>{node}</Text>;
};

export default DateDistance;
