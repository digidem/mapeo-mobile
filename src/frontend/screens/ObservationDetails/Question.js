// @flow
import React from "react";

import SelectOne from "./SelectOne";
import TextArea from "./TextArea";

import type { Field } from "../../context/PresetsContext";

export type QuestionProps = {
  field: Field,
  value: any,
  onChange: (value: any) => any
};

const Question = (props: QuestionProps) => {
  // This is needed for Flow to understand the type refinement
  const { field, ...other } = props;
  if (field.type === "select_one" && Array.isArray(field.options)) {
    return <SelectOne {...other} field={field} />;
  } else return <TextArea {...props} />;
};

export default Question;
