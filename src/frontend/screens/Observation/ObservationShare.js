/* eslint-disable react-native/no-raw-text */
// @flow
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TurndownService from "turndown-rn";
import { defineMessages, useIntl, RawIntlProvider } from "react-intl";

import {
  FormattedFieldProp,
  FormattedFieldValue,
  FormattedPresetName,
  FormattedCoords,
  FormattedObservationDate,
} from "../../sharedComponents/FormattedData";
import { getProp } from "../../lib/utils";
import type { PresetWithFields } from "../../context/ConfigContext";
import type { Observation } from "../../context/ObservationsContext";
import useSettingsValue from "../../hooks/useSettingsValue";

const m = defineMessages({
  alertSubject: {
    id: "screens.Observation.ObservationView.alertSubject",
    defaultMessage: "Mapeo Alert",
    description: "Subject-line for shared observations",
  },
  alertFooter: {
    id: "screens.Observation.ObservationView.alertFooter",
    defaultMessage: "Sent from Mapeo",
    description: "Footer for shared observations message",
  },
});

type ShareMessageProps = {
  observation: Observation,
  preset?: PresetWithFields,
};

export const ShareSubject = ({ observation, preset }: ShareMessageProps) => {
  const { formatMessage: t } = useIntl();
  return (
    <>
      {t(m.alertSubject) + " — "}
      <i>
        <b>
          <FormattedPresetName preset={preset} />
        </b>
      </i>
      {" — "}
      <FormattedObservationDate observation={observation} variant="long" />
    </>
  );
};

export const ShareMessage = ({ observation, preset }: ShareMessageProps) => {
  const { formatMessage: t } = useIntl();
  const coordinateFormat = useSettingsValue("coordinateFormat");

  const { value } = observation;
  const { lon, lat } = value;

  const completedFields = preset
    ? preset.fields.filter(f => {
        const fieldValue = getProp(value.tags, f.key);
        return fieldValue != null && fieldValue !== "";
      })
    : [];

  const title = (
    <>
      {t(m.alertSubject) + " — "}
      <i>
        <b>
          <FormattedPresetName preset={preset} />
        </b>
      </i>
    </>
  );

  return (
    <>
      <p>
        {title}
        <br />
        <FormattedObservationDate observation={observation} variant="long" />
        <br />
        {lon != null && lat != null ? (
          <FormattedCoords format={coordinateFormat} lat={lat} lon={lon} />
        ) : null}
      </p>
      {value.tags.notes ? <p>{value.tags.notes}</p> : null}
      {completedFields.map((field, idx) => (
        <p key={idx}>
          <b>
            <FormattedFieldProp field={field} propName="label" />:
          </b>
          <br />
          <i>
            <FormattedFieldValue
              field={field}
              value={getProp(value.tags, field.key)}
            />
          </i>
        </p>
      ))}
      <p>{"— " + t(m.alertFooter) + " —"}</p>
    </>
  );
};

// It might be more efficient to do this with a React renderer that rendered
// directly to a Markdown string, but that does not exist and this is far from a
// performance bottleneck. This renders a React element to an HTML string and
// from there to Markdown. Can be adapted to return HTML if needed for other
// types of share, and different markdown formatting (currently configured for
// WhatsApp rich message support). Any context that `node` requires needs to be
// passed through as a provider, since this is a separate render tree to the
// rest of the app, e.g. settings context will be needed here if we add
// coordinated settings to the FormattedCoords component
export function renderToString(node: React.Node, options: { intl: {} }) {
  const turndownService = new TurndownService({
    strongDelimiter: "*",
  });
  const htmlString = renderToStaticMarkup(
    <RawIntlProvider value={options.intl}>{node}</RawIntlProvider>
  );
  return turndownService.turndown(htmlString);
}
