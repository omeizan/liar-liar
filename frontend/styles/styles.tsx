import { StyleSheet, Dimensions } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Toast } from "toastify-react-native";
import { Platform } from "react-native";

const { height } = Dimensions.get("window");

export const getStyles = () => {
  const orange = "#b32a00";
  const yellow = "#e8a23a";
  const lightgrey = "#f5f5f5";
  const grey = "#333";
  const calculatedHeight = height - 60;

  const [fontsLoaded] = useFonts({
    Shrikhand: require("../assets/fonts/Shrikhand-Regular.ttf"), // Make sure to place the font file in your assets/fonts folder
  });

  const backgroundColor = useThemeColor(
    { light: "#333", dark: "#333" },
    "background"
  );
  const modalOverlayColor = useThemeColor(
    { light: "rgba(0,0,0,0.0)", dark: "rgba(0,0,0,0.0)" },
    "modalOverlay"
  );
  const modalContentColor = useThemeColor(
    { light: "#333", dark: "#333" },
    "modalContent"
  ); // Darker shades for modal content
  const fontColor = useThemeColor({ light: "black", dark: "white" }, "text"); // Keeping the default font color
  const buttonBackgroundColor = useThemeColor(
    { light: yellow, dark: yellow },
    "buttonBackground"
  ); // Darker shades for button background
  const buttonBorderColor = useThemeColor(
    { light: orange, dark: orange },
    "buttonBorder"
  ); // Darker yellow for light mode, darker orange for dark mode
  const disabledTextColor = useThemeColor(
    { light: lightgrey, dark: lightgrey },
    "disabledText"
  ); // Lighter shades for disabled text

  return StyleSheet.create({
    containerWithNavbar: {
      padding: 5,
      marginTop: Platform.OS === "ios" ? 20 : 0,
      flex: 1,
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor,
      color: fontColor,
      fontFamily: "Shrikhand",
    },

    container: {
      position: "relative",
      flex: 1,
      justifyContent: "center",
      width: "100%",
      paddingVertical: 40,
      paddingHorizontal: 15,
      alignItems: "center",
      backgroundColor,
      color: fontColor,
      fontFamily: "Shrikhand",
    },
    mainContent: {
      marginTop: 5,
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor,
      color: fontColor,
      fontFamily: "Shrikhand",
    },
    defaultText: {
      color: fontColor, // Apply theme-based text color
    },
    logo: {
      width: 300,
      height: 300,
      marginBottom: 50,
    },
    buttonRow: {
      flexDirection: "row",
      flexWrap:"wrap",
      justifyContent:"center",
      alignItems:"center",
      gap: 20,
    },

    controlRow: {
      flexDirection: "row",
      flexWrap:"wrap",
      justifyContent:"flex-start",
      alignItems:"center",
      gap: 20,
    },
    button: {
      backgroundColor: buttonBackgroundColor, 
      padding: 5,
      borderWidth: 5,
      borderColor: buttonBorderColor,
      borderRadius: 10,
      alignItems: "center",
      fontFamily: "Shrikhand",
      justifyContent: "center",
      width: 150,
      height: 150,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontFamily: "Shrikhand",
      marginTop: 10,
    },
    modalContentContainer: {
      position: "relative",
      borderRadius: 10,
      margin: 10,
      paddingBottom: 10,
      paddingRight: 10,
      flex: 1,
      borderWidth: 5,
      width: "100%",
      justifyContent: "space-between",
      height: "100%",
      borderColor: buttonBackgroundColor,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 0,
      backgroundColor: modalOverlayColor, // Using theme-based modal overlay color
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: modalOverlayColor, // Using theme-based modal overlay color
    },
    modalContent: {
      zIndex: 3,
      backgroundColor: modalContentColor, // Using theme-based modal content color
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "80%",
      // iOS shadow properties
      shadowColor: "#000", // Black shadow
      shadowOffset: { width: 0, height: -4 }, // Shadow at the top
      shadowOpacity: 0.3, // Adjust opacity
      shadowRadius: 5, // Adjust shadow spread

      elevation: 5,
    },

    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    modalForm: {
      margin: 10,
    },
    modalControls: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    centralModalControls: {
      marginTop:5,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      gap:10,
      flexWrap:"wrap",
      justifyContent: "center",
    },
    modalControlButtonText: {
      fontFamily: "Shrikhand",
      color: fontColor,
    },
    cancelButton: {
      backgroundColor: orange,
    },
    modalControlButton: {
      backgroundColor: buttonBackgroundColor, // Using theme-based button background
      padding: 10,
      borderWidth: 5,
      marginLeft: 10,
      borderColor: buttonBorderColor, // Using theme-based button border
      borderRadius: 10,
      alignItems: "center",
      fontFamily: "Shrikhand",
      justifyContent: "center",
    },
    modalControlButtonDisabled: {
      backgroundColor: "#888",
      padding: 10,
      borderWidth: 5,
      marginLeft: 10,
      borderColor: "#888",
      borderRadius: 10,
      alignItems: "center",
      fontFamily: "Shrikhand",
      justifyContent: "center",
    },
    modalTitle: {
      top: -20,
      left: 20,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: modalContentColor,
      color: fontColor,
      fontFamily: "Shrikhand",
      fontSize: 20,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      padding: 10,
      width: "100%",
      marginBottom: 10,
      textAlign: "center",
    },

    

    pickerContainer: {
      marginTop:5,
      position: "relative",
      borderWidth: 3,
      width:210,
      justifyContent:"center",
      alignItems:"center",
      height:75,
      borderRadius: 10,
      padding: 10,
      borderColor: buttonBackgroundColor,
    },
    small: {},
    medium: {},
    large: {},

    pickerLabel: {
      position: "absolute",
      top: -15,
      left: 10,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: modalContentColor,
      fontFamily: "Shrikhand",
      fontSize: 14,
      color: fontColor,
      marginBottom: 10,
    },
    selectedItem: {
      backgroundColor: buttonBorderColor, // selected item background color (example)
      padding: 3,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      borderWidth: 3,
      width: 35,
      height: 35,
      borderColor: buttonBackgroundColor, // selected item border color
    },

    option: {
      padding: 3,
      borderWidth: 3,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderRadius: 5,
      width: 35,
      height: 35,
    },

    nonSelectedOption: {
      borderColor: "#888",
    },

    nonSelectedText: {
      color: "#888",
    },

    optionText: {
      fontSize: 14,
      fontFamily: "Shrikhand",
      color: fontColor,
      textAlign: "center",
    },

    titleText: {
      fontSize: 18,
      fontFamily: "Shrikhand",
      color: fontColor,
      textAlign: "center", 
      textDecorationLine:"underline",
      textDecorationColor:fontColor,
      textDecorationStyle:"solid",
    },
    

    warningText: {
      fontSize: 14,
      fontFamily: "Shrikhand",
      color: buttonBackgroundColor,
      textAlign: "center", // Center the text
    },
    optionImage: {
      marginTop: 5,
      resizeMode: "contain", // Ensure the image is not distorted
    },

    //Grids
    gridContainer2: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      margin: 10,
    },
    gridContainer2Item: {
      alignSelf: "flex-start",
      marginRight: 10,
      marginBottom: 10,
    },

    //Text Input
    textInputContainer: {
      position: "relative",
      padding: 10,
      borderWidth: 3,
      borderRadius: 10,
      margin: 5,
      marginBottom: 15,
      borderColor: "#888",
    },
    textInputLabel: {
      position: "absolute",
      top: -15,
      left: 10,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: modalContentColor,
      fontFamily: "Shrikhand",
      fontSize: 14,
      color: fontColor,
      marginBottom: 10,
    },

    textCountLabel: {
      position: "absolute",
      bottom: -15,
      right: 10,
      paddingLeft: 5,
      paddingRight: 5,
      alignSelf: "flex-start",
      backgroundColor: modalContentColor,
      fontFamily: "Shrikhand",
      fontSize: 14,
      color: fontColor,
      marginBottom: 10,
    },
    textInput: {
      fontFamily: "Shrikhand",
      fontSize: 14,
      color: fontColor,
      margin: 5,
    },
    largeTextInput: {
      fontFamily: "Shrikhand",
      fontSize: 14,
      height: 100,
      maxHeight: 100,
      color: fontColor,
      margin: 5,
    },
    textInputFocused: {
      borderWidth: 0,
    },
    textInputPlaceholder: {
      color: "#888",
    },
    textInputContainerFocused: {
      borderColor: buttonBackgroundColor,
    },


    imagePickerLabel: {
      position: "absolute",
      top: -15,
      left: 10,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: modalContentColor,
      fontFamily: "Shrikhand",
      fontSize: 14,
      color: fontColor,
      marginBottom: 10,
    },
    imagePickerContainer: {
      width: 100,
      height: 100,
      margin: 5,
      marginBottom: 30,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    imagePickerImage: {
      width: "80%",
      height: "80%",
      resizeMode: "cover",
    },
    imagePickerPlaceholder: {
      width: "100%",
      height: "100%",
      padding: 5,
      margin: 5,
      flexDirection: "row",
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    imagePickerPlaceholderText: {},
    imagePickerOverlay: {
      position: "absolute",
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: modalContentColor,
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      bottom: -20,
      right: 5,
      padding: 5,
      borderRadius: 5,
    },
    imagePickerIcon: {
      color: fontColor,
      marginHorizontal: 10,
    },

    promptText:{
      fontSize: 15,
      fontFamily: "",
      color: fontColor,
      textAlign: "left",
      marginBottom:5,
    },
    editText: {
      color: "#fff",
      fontSize: 14,
    },

    participantsList: {
      width: "100%",
      height: "70%",
      overflowX: "hidden",
      overflowY: "auto",
      marginTop:5,

    },
    backgroundBar:{
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: buttonBackgroundColor,
      transitionProperty:"width",
      transitionDuration:"0.5s",
    },
    participantCard: {
      zIndex:1,
      position:"relative",
      flex: 1,
      flexDirection: "row",
      width: "100%",
      padding: 5,
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,

      height: 100,
      maxHeight: 100,
      
    },

    votingCard: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems:"center",
      padding: 5,
      marginVertical: 10,
      height: 100,
      maxHeight: 100
    },

    selectedParticipantCard:{
      borderRadius:10,
      borderLeftColor:buttonBackgroundColor,
      borderLeftWidth:15,
    },
    avatar: {
      height: 70,
      width: 70,
      borderWidth: 3,
      borderColor: buttonBorderColor,
      borderRadius: 10,
      marginHorizontal: 15,
      padding: 5,
    },

    resultAvatar: {
      height: 70,
      width: 70,
      borderWidth: 3,
      borderColor: buttonBorderColor,
      borderRadius: 10,
      margin: 15,
      padding: 5,
    },

    participantsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      height:"70%",
      gap:20,
      justifyContent: "center",
      paddingHorizontal: 10,
    },

    participantDetails: {
      flex: 1,
      height: "100%",
      padding:5,
      flexDirection: "row",
    },

    voterDetails: {
      flex: 1,
      height: "100%",
      borderWidth:1,
      flexDirection: "column",
    },
    participantName: {
      fontFamily: "Shrikhand",
      alignSelf: "center",
      marginTop: 60,
      marginRight: 10,
      height: "100%",
      alignItems: "center",
      textAlign: "center",
      justifyContent: "center",
      color: fontColor,
      fontSize: 16,
    },
    youBadge: {
      position: "absolute",
      top: -15,
      right: -15,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: buttonBackgroundColor,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: buttonBorderColor,
      fontFamily: "Shrikhand",
      fontSize: 12,
      color: fontColor,
      marginBottom: 10,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 5,
    },

    timerText: {
      color: "white",
      position: "absolute",
      fontSize: 16,
      backgroundColor:"transparent",
      fontFamily: "Shrikhand",
    },
    roundTimer: {
      position: "absolute",
      top: -15,
      right: -15,
      flex: 1,
      backgroundColor:"transparent",
      overflow:"visible",
      justifyContent: "center",
      alignItems: "center",
      height: 100,
      width: 100,
      fontFamily: "Shrikhand",
      fontSize: 19,
      color: fontColor,
    },

    bubbleContainer: {
      padding:5,
      flexDirection: "row",
      alignItems: "center",
    },
    chatBubble: {
      backgroundColor: buttonBackgroundColor,
      borderColor:buttonBorderColor,
      borderWidth:5,
      padding: 10,
      borderRadius: 15,
      maxWidth: 150,
      alignSelf: "flex-start",
      marginVertical: 5,
      position: "relative",
    },
    bubbleTail: {
      position:"absolute",
      width: 0,
      height: 0,
      left:0,
      borderTopWidth:10,
      borderLeftWidth: 10,
      borderBottomWidth: 10,
      borderStyle: "solid",
      borderTopColor: "transparent",
      borderLeftColor: "transparent",
      borderBottomColor: buttonBorderColor,
      marginLeft: -5,
      marginTop: -5,
    },
    bubbleText: {
      fontSize: 14,
      color: "#000",
      fontFamily: "Shrikhand",
    },
    roundVotes :{
      position: "absolute",
      bottom: -15,
      right: -15,
      paddingLeft: 10,
      paddingRight: 10,
      alignSelf: "flex-start",
      backgroundColor: buttonBackgroundColor,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: buttonBorderColor,
      fontFamily: "Shrikhand",
      fontSize: 12,
      color: fontColor,
      marginBottom: 10
    }, 
    liarAvatar : {
      borderWidth: 7,
    }


  });
};
