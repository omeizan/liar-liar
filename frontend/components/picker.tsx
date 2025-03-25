import React from "react";
import { getStyles } from "@/styles/styles";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";

interface PickerOption {
  value: string;
  text: string;
  image?: string;
}

interface CustomPickerProps {
  size: "small" | "medium" | "large";
  unit: string;
  options: PickerOption[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  label: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({size,unit,options, selectedValue, setSelectedValue, label }) => {

    const styles = getStyles();
  const handleSelectOption = (option: PickerOption) => {
    setSelectedValue(option.value); 
  };

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>

      <FlatList
        data={options}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              item.value === selectedValue ? styles.selectedItem : styles.option,
              item.value !== selectedValue && styles.nonSelectedOption // Apply non-selected styling
            ]}
            onPress={() => handleSelectOption(item)}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.optionImage} />}
            <Text style={[styles.optionText, item.value !== selectedValue && styles.nonSelectedText]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.value}
        numColumns={5}
      />
    </View>
  );
};


export default CustomPicker;
