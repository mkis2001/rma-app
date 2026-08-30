import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, Text, TextInput } from "react-native";
import { colors, inputStyles, typography } from "../../theme";
import { Label } from "../typography/label";

type FormTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
};

export const FormTextInput = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  placeholder,
  multiline = false,
  secureTextEntry = false,
}: FormTextInputProps<T>) => {
  return (
    <>
      {label && <Label title={label} />}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[
                inputStyles.textInput,
                error ? styles.inputError : undefined,
              ]}
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline={multiline}
              secureTextEntry={secureTextEntry}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
        name={name}
        rules={rules}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputError: {
    borderBottomColor: colors.error,
  },
  errorText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize * 0.7,
    color: colors.error,
    marginTop: 2,
  },
});
