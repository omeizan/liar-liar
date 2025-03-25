import { Link, router, Stack } from "expo-router";
import { StyleSheet, View, Text, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getStyles } from "@/styles/styles";
import CustomLargeButton from "@/components/CustomLargeButton";
import VALUES from "@/constants/Values";

export default function NotFound() {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
          />
      <Text style={styles.buttonText}>Somebody Lied! </Text>
      <Text style={styles.buttonText}>There's nothing Here! </Text>
      
        <CustomLargeButton
          label={'Go Home'}
          icon={VALUES.Icons.HOME}
          onPress={() => {
            router.replace('/')
          }}
        />
     
    </View>
  );
}
