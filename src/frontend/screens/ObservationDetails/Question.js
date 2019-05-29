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
  const { field } = props;
  if (field.type === "select_one" && Array.isArray(field.options))
    return <SelectOne {...props} />;
  else return <TextArea {...props} />;
};

export default Question;
