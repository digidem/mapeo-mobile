import React from "react";

import SelectOne from "./SelectOne";
import SelectMultiple from "./SelectMultiple";
import TextArea from "./TextArea";

import type { Field } from "../../context/ConfigContext";

export type QuestionProps = {
  field: Field;
  value: any;
  onChange: (value: any) => any;
};

const Question = ({ field, ...other }: QuestionProps) => {
  if (field.type === "select_one" && Array.isArray(field.options)) {
    return <SelectOne {...other} field={field} />;
  } else if (field.type === "select_multiple" && Array.isArray(field.options)) {
    return <SelectMultiple {...other} field={field} />;
  } else return <TextArea {...{ field, ...other }} />;
};

export default Question;
