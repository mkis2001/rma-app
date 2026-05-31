import { Picker } from "@react-native-picker/picker";
import { View } from "moti";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet } from "react-native";
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
    <View style={styles.container}>
      {label && <Label title={label} />}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
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
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.text,
    borderBottomWidth: 2,
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
});
