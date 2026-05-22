import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TextInput } from "react-native";
import { colors, typography } from "../../theme";
import { Label } from "../typography/label";

type FormTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
  placeholder?: string;
  multiline?: boolean;
};

export const FormTextInput = <T extends FieldValues>({
  control,
  name,
  rules,
  placeholder,
  multiline = false,
}: FormTextInputProps<T>) => {
  return (
    <>
      {placeholder && <Label title={placeholder} />}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline={multiline}
          />
        )}
        name={name}
        rules={rules}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    borderBottomColor: colors.text,
    borderBottomWidth: 2,
  },
});
