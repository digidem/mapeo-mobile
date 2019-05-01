// @flow
import * as React from "react";

import DraftObservationContext from "../../context/DraftObservationContext";

type Props = {
  fieldKey: string,
  children: ({ value: any, onChange: (fieldValue: any) => any }) => React.Node
};

const Field = ({ fieldKey, children }: Props) => (
  <DraftObservationContext.Consumer>
    {({ value: { tags }, setValue }) => {
      const value = tags[fieldKey];
      const onChange = fieldValue =>
        setValue({
          tags: {
            ...tags,
            [fieldKey]: fieldValue
          }
        });
      return children({ value, onChange });
    }}
  </DraftObservationContext.Consumer>
);

export default Field;
