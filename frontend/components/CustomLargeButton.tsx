import { getStyles } from "@/styles/styles";
import {TouchableOpacity,Text, TouchableOpacityProps } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  icon: string;
}

const ICON_SIZE = 30;
const ICON_COLOR = "white";

const CustomLargeButton: React.FC<CustomButtonProps> = ({label,icon,onPress}) => {
  const styles = getStyles();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Icon name={icon} size={ICON_SIZE} color={ICON_COLOR} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomLargeButton;
