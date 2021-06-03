// @flow
import React from "react";

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../sharedComponents/List";

type Props = {|
  value: any,
  onChange: (value: any) => any,
  options: Array<{|
    value: any,
    label: string,
    hint?: string,
  |}>,
|};

const SelectOne = ({ value, options, onChange }: Props) => (
  <List dense>
    {options.map((item, index) => (
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

export default React.memo<Props>(SelectOne);
