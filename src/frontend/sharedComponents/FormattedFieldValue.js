// @flow
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { convertSelectOptionsToLabeled } from "../lib/utils";
import type { Field } from "../context/ConfigContext";

const m = defineMessages({
  noAnswer: {
    // Keep original id to avoid re-translation
    id: "screens.Observation.ObservationView.noAnswer",
    defaultMessage: "No answer",
    description:
      "Placeholder text for fields on an observation which are not answered",
  },
});

type Props = {|
  value: any,
  field: Field,
|};

const FormattedFieldValue = ({ value, field }: Props) => {
  const { formatMessage: t } = useIntl();
  // Select multiple answers are an array, so we join them with commas
  const formattedValue = (Array.isArray(value) ? value : [value])
    // Filter any undefined values or empty strings (an empty string can come
    // from a user deleting an answer)
    .filter(value => typeof value !== "undefined" && value !== "")
    .map(value =>
      t({
        id: `fields.${field.id}.options.${JSON.stringify(value)}`,
        defaultMessage: getValueLabel(value, field),
      })
    )
    .join(",");
  // This will return a noAnswer string if formattedValue is undefined or an
  // empty string
  return <>{formattedValue || t(m.noAnswer)}</>;
};

function getValueLabel(
  value: null | boolean | number | string,
  field: Field
): string {
  if (field.type === "select_one" || field.type === "select_multiple") {
    // Look up label from field options. This is not necessary for presets
    // created with mapeo-settings-builder@^3.1.0, which will have these options
    // in the translation file, but is needed for older versions of presets
    const options = convertSelectOptionsToLabeled(field.options);
    const matchingOption = options.find(option => option.value === value);
    if (matchingOption) return matchingOption.label;
  }
  if (value === null) {
    return "NULL";
  } else if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  } else if (typeof value === "number") {
    return String(value);
  } else {
    return value;
  }
}

export default FormattedFieldValue;
