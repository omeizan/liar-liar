import Toast from "react-native-toast-message";
import toastConfig from "@/styles/toastConfig";
import { getStyles } from "@/styles/styles";
import React from "react";
import { View, Text, Image} from "react-native";

export default function LoadingScreen() {

    const styles = getStyles()
    
    return (
    <View style={styles.container}>
        <Image
                source={require("../assets/images/loading.png")}
                style={styles.logo}
              />
        <Toast config={toastConfig} />
    </View>
    )
}