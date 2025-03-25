import Toast from "react-native-toast-message";
import toastConfig from "@/styles/toastConfig";
import { getStyles } from "@/styles/styles";
import React from "react";
import { View, Text} from "react-native";

export default function LoadingScreen() {

    const styles = getStyles()

    return (
    <View style={styles.container}>
        <Text>Loading...</Text>
        <Toast config={toastConfig} />
    </View>
    )
}