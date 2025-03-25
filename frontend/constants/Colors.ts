;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    white:"white",
    tint: tintColorLight,
    icon: '#687076',
    buttonBackground: '#FFA500',
    buttonBorder: '#FFA500',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    modalContent: '#ffffff', // Light mode modal content background
    modalOverlay: 'rgba(0, 0, 0, 0.5)', // Light mode modal overlay background
    accentYellow: '#FFD700', // Yellow accent for light mode
    accentOrange: '#FFA500', // Orange accent for light mode
    greyBackground: '#F0F0F0', // Light grey background for general use
    disabledText : "#333"
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    white:"white",
    tint: tintColorDark,
    icon: '#9BA1A6',
    buttonBackground: '#FFA500',
    buttonBorder: '#FFA500',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    modalContent: '#444', // Dark mode modal content background
    modalOverlay: 'rgba(0, 0, 0, 0.8)', // Dark mode modal overlay background
    accentYellow: '#FFD700', // Yellow accent for dark mode
    accentOrange: '#FFA500', // Orange accent for dark mode
    greyBackground: '#333333', // Dark grey background for general use
    disabledText : "#f5f5f5"
  },
};
