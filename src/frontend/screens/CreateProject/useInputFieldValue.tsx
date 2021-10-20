import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const defaultValidator = (value: string) => value.length > 0;

export const useInputFieldValue = (
  initialValue = "",
  validator = defaultValidator
): [string, Dispatch<SetStateAction<string>>, boolean, () => boolean] => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const [hasTouched, setHasTouched] = useState(false);

  const validate = useCallback(() => {
    const isValid = validator(value);
    setError(!isValid);
    return isValid;
  }, [validator, value]);

  useEffect(() => {
    if (value.length > 0 && !hasTouched) {
      setHasTouched(true);
    }
  }, [hasTouched, value]);

  useEffect(() => {
    if (hasTouched) {
      setError(!validator(value));
    }
  }, [hasTouched, validator, value]);

  return [value, setValue, error, validate];
};
