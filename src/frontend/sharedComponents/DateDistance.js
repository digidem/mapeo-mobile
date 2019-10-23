// @flow
import React from "react";
import { Text, AppState } from "react-native";
import distanceInWordsStrict from "date-fns/distance_in_words_strict";
import esLocale from "date-fns/locale/es";
import enLocale from "date-fns/locale/en";

import { formatDate } from "../lib/utils";
import type { Style } from "../types";

type AppStateType = "active" | "background" | "inactive";

type Props = {
  date: Date,
  addSuffix: boolean,
  style?: Style<typeof Text>
};

const oneSecond = 1000;
const oneMinute = 60 * oneSecond;

/**
 * Formats the a date and returns its distance in words from now, e.g. "2 hours
 * ago". It updates itself as needed (e.g. once a second when the distance is <
 * 60 seconds ago, once a minute when < 60 minutes ago etc, but only for 5
 * minutes because long-running timers would cause a perf issue)
 */
class DateDistance extends React.Component<Props> {
  static defaultProps = {
    addSuffix: true
  };
  _timeoutId: null | TimeoutID;

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    if (this._timeoutId) clearTimeout(this._timeoutId);
  }

  handleAppStateChange = (nextAppState: AppStateType) => {
    // Clear timeout while app is in the background, add it back when app returns
    if (nextAppState === "active") {
      this.addRefreshTimer();
    } else if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  };

  addRefreshTimer() {
    if (this._timeoutId) clearTimeout(this._timeoutId);
    const distance = Date.now() - this.props.date;
    // refresh distance every 30 seconds up to 15 minutes after observation was
    // created, after that the user would need to navigate away and return in
    // order to see the distance increment
    if (distance > 15 * oneMinute) return;
    this._timeoutId = setTimeout(() => this.forceUpdate(), oneMinute / 2);
  }

  render() {
    const { style, date, addSuffix } = this.props;
    this.addRefreshTimer();
    return (
      <Text style={style}>
        {formatDateTime(date, { addSuffix, locale: enLocale })}
      </Text>
    );
  }
}

// We use relative dates for anything within the last 7 days, and then absolute
// dates for anything else.
const USE_WORDS_WITHIN = 7 * 24 * 60 * 60 * 1000; // 7 days
function formatDateTime(date, opts) {
  const now = Date.now();
  const diff = now - date;
  if (diff < oneMinute) {
    return "ahorita";
  } else if (diff <= USE_WORDS_WITHIN) {
    return distanceInWordsStrict(now, date, opts);
  } else {
    return formatDate(date);
  }
}

export default DateDistance;
