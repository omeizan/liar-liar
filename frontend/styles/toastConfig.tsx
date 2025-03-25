import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.toastStyle, { borderBottomColor: 'red' }]}>
      <Icon name="times-circle" size={24} color="red" style={styles.iconStyle} />
      <View style={styles.textContainer}>
        {text1 && (
          <Text style={[styles.toastTextStyle, { color: 'red' }]}>
            {text1}
          </Text>
        )}
        {text2 && <Text style={[styles.toastTextStyle, { color: 'red' }]}>{text2}</Text>}
      </View>
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.toastStyle, { borderBottomColor: '#28a745' }]}>
      <Icon name="check-circle" size={24} color="#28a745" style={styles.iconStyle} />
      <View style={styles.textContainer}>
        {text1 && (
          <Text style={[styles.toastTextStyle, { color: '#28a745' }]}>
            {text1}
          </Text>
        )}
        {text2 && <Text style={[styles.toastTextStyle, { color: '#28a745' }]}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.toastStyle, { borderBottomColor: 'black' }]}>
      <View style={styles.textContainer}>
        {text1 && (
          <Text style={[styles.toastTextStyle, { color: 'black' }]}>
            {text1}
          </Text>
        )}
        {text2 && <Text style={[styles.toastTextStyle, { color: 'black' }]}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastStyle: {
    alignSelf: "center",
    width: '90%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    borderBottomWidth: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  toastTextStyle: {
    fontSize: 16,
    fontFamily: 'shrikhand',
    color: 'black',
  },
});

export default toastConfig;
