import React from "react";

import SelectOne from "./SelectOne";
import SelectMultiple from "./SelectMultiple";
import TextArea from "./TextArea";

import type { Field } from "../../context/ConfigContext";

export type QuestionProps = {
  field: Field;
  value: any;
  onChange: (value: any) => any;
  autoFocus?: boolean;
};

const Question = ({ field, autoFocus, ...other }: QuestionProps) => {
  if (field.type === "select_one" && Array.isArray(field.options)) {
    return <SelectOne {...other} field={field} />;
  } else if (field.type === "select_multiple" && Array.isArray(field.options)) {
    return <SelectMultiple {...other} field={field} />;
  } else return <TextArea autoFocus={true} {...{ field, ...other }} />;
};

export default Question;
