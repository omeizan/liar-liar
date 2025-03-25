import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, Platform, ScrollView } from "react-native";
import { getStyles } from "@/styles/styles";

interface CustomTextInputProps extends TextInputProps {
  label: string;
  multiline?: boolean;
  full:boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ full,label, multiline = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!props.value || props.value.length === 0);

  const styles = getStyles();

  return (
    
    <View style={[styles.textInputContainer,( ( isFocused || !isEmpty)  && styles.textInputContainerFocused ) ,full?{width:"100%"}:{width:"50%"}]}>
      <Text style={styles.textInputLabel}>{label}</Text>
      <ScrollView
                    keyboardShouldPersistTaps='handled'>
      <TextInput
        {...props}
        scrollEnabled={false}
        multiline={multiline}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => {
          setIsEmpty(text.length === 0);
          props.onChangeText && props.onChangeText(text);
        }}
        style={[
          Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
          styles.textInput,
          multiline && styles.largeTextInput,
          isFocused && styles.textInputFocused,
          isEmpty && styles.textInputPlaceholder
        ]}
      />
      </ScrollView>
      {props.maxLength && 
        <Text style={styles.textCountLabel}>{`${props.value?.trim().length || 0}/${props.maxLength}`}</Text>
      }
      
    </View>
  );
};

export default CustomTextInput;
