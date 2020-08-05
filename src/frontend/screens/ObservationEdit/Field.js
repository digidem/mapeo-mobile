// @flow
import * as React from "react";

import useDraftObservation from "../../hooks/useDraftObservation";

type Props = {
  fieldKey: string,
  children: ({ value: any, onChange: (fieldValue: any) => any }) => React.Node,
};

const Field = ({ fieldKey, children }: Props) => {
  const [{ value: draftValue }, { updateDraft }] = useDraftObservation();
  const tags = draftValue ? draftValue.tags : {};
  const value = tags[fieldKey];
  const onChange = fieldValue =>
    updateDraft({
      tags: {
        ...tags,
        [fieldKey]: fieldValue,
      },
    });
  return children({ value, onChange });
};

export default Field;
