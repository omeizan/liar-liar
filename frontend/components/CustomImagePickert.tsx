import React, { useEffect, useRef } from "react";
import {
  Alert,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { getStyles } from "@/styles/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

interface CustomImagePickerProps {
  imageUri: string;
  setImageUri: (uri: string) => void;
}

const CustomImagePicker: React.FC<CustomImagePickerProps> = ({
  imageUri,
  setImageUri,
}) => {
  useEffect(() => {}, [imageUri]);
  const styles = getStyles();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pickImage = async (fromCamera: boolean) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePress = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage(true);
          if (buttonIndex === 2) pickImage(false);
        }
      );
    } else if (Platform.OS === "android") {
      Alert.alert(
        "Select Image",
        "Choose an image source",
        [
          { text: "Camera", onPress: () => pickImage(true) },
          { text: "Gallery", onPress: () => pickImage(false) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDelete = () => {
     if (imageUri?.startsWith("blob:")) {
        URL.revokeObjectURL(imageUri);
      }
      setImageUri("");
    };
  

  return (
    <TouchableOpacity style={styles.imagePickerContainer} onPress={handlePress}>
      {Platform.OS === "web" && <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageUri(imageUrl);
          }
        }}
      />}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePickerImage} />
      ) : (
        
        <View style={styles.imagePickerPlaceholder}>
          <Icon name="photo" size={30} color="white" />
        </View>
      )}
      <View style={styles.imagePickerOverlay}>
        {/* Edit Icon */}
        <TouchableOpacity onPress={handlePress} >
        <Icon
          name={imageUri ? "pencil" : "plus"}
          size={15}
          style={styles.imagePickerIcon}
        />
        </TouchableOpacity>
        

        {imageUri && (
          <TouchableOpacity onPress={handleDelete} >
            <Icon name="trash" size={15} color="white" style={styles.imagePickerIcon} />
          </TouchableOpacity>
        )}
        </View>
      <View>
        
      </View>
      <Text style={styles.imagePickerLabel}>Photo</Text>
    </TouchableOpacity>
  );
};

export default CustomImagePicker;
