// @flow
import React from "react";
import { useIntl } from "react-intl";
import type { Field } from "../context/ConfigContext";

type Props = {|
  field: Field,
  propName: "label" | "placeholder",
|};

const FormattedFieldProp = ({ field, propName }: Props) => {
  const { formatMessage: t } = useIntl();
  const fieldKey = Array.isArray(field.key) ? field.key[0] : field.key;
  const value = field[propName]
    ? t({
        id: `fields.${field.id}.${propName}`,
        defaultMessage: field[propName],
      })
    : // Never show a blank label, fall back to field.key, otherwise return null
    propName === "label"
    ? fieldKey
    : undefined;
  if (!value) return null;
  return <>{value}</>;
};

export default FormattedFieldProp;
