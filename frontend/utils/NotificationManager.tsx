import Toast from "react-native-toast-message";

const NotificationManager = {
  showProcessingToasts: (message: string) => {
    Toast.show({
      type: "info",
      text1: "",
      text2: message,
    });
  },
   showErrorToasts : (message: string) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  
    showSuccessToasts : (message: string) => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: message,
      });
    }
};

export default NotificationManager;
