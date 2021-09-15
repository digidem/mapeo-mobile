import * as React from "react";

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../sharedComponents/List";

interface Props<Value> {
  value: Value;
  onChange: (value: Value) => void;
  options: {
    value: Value;
    label: string;
    hint?: string;
  }[];
}

const SelectOne = <Value extends string>({
  value,
  options,
  onChange,
}: Props<Value>) => (
  <List dense>
    {options.map(item => (
      <ListItem
        key={item.value}
        testID={`${item.value}LanguageButton`}
        onPress={() => value !== item.value && onChange(item.value)}
      >
        <ListItemIcon
          iconName={
            item.value === value
              ? "radio-button-checked"
              : "radio-button-unchecked"
          }
        />
        <ListItemText primary={item.label} secondary={item.hint}></ListItemText>
      </ListItem>
    ))}
  </List>
);

export default React.memo(SelectOne);
