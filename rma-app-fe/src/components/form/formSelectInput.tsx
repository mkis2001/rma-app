import { Picker } from "@react-native-picker/picker";
import { View } from "moti";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import { colors, typography } from "../../theme";
import { Label } from "../typography/label";

type FormSelectInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
  label: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
};

export const FormSelectInput = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  placeholder,
  options,
}: FormSelectInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          {label && <Label title={label} />}
          <View
            style={[styles.container, error ? styles.containerError : undefined]}
          >
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
              mode="dropdown"
            >
              {placeholder && (
                <Picker.Item
                  style={styles.placeholder}
                  label={placeholder}
                  value=""
                  enabled={false}
                />
              )}
              {options.map((opt) => (
                <Picker.Item
                  style={styles.item}
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.text,
    borderBottomWidth: 2,
  },
  containerError: {
    borderBottomColor: colors.error,
  },
  picker: {
    backgroundColor: colors.background,
    borderRadius: 20,
    fontFamily: typography.fontFamily,
  },
  item: {
    paddingBottom: -5,
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
  },
  placeholder: {
    paddingBottom: -5,
    backgroundColor: colors.background,
    color: colors.textLighter,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
  },
  errorText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize * 0.7,
    color: colors.error,
    marginTop: 2,
  },
});
