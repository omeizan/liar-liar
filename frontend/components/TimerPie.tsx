import { getStyles } from '@/styles/styles';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CIRCULAR_CIRCUMFERENCE = 270;
const CIRCLE_RADIUS = CIRCULAR_CIRCUMFERENCE / (2 * Math.PI);

interface Props {
  duration: number; // Countdown duration in milliseconds
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TimerPie: React.FC<Props> = ({ duration }) => {

  const styles = getStyles()
  const { width, height } = Dimensions.get('window');
  const stringifiedWidth = String(width / 7);
  const stringifiedHeight = String(height / 20);
  const [progressValue, setProgressValue] = useState(1);

  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      useNativeDriver: false,
      toValue: 0,
      duration: duration,
    }).start();

    const listenerId = progress.addListener(({ value }) => setProgressValue(value));

    return () => {
      progress.removeListener(listenerId);
    };
  }, [duration]);

  const animatedProps = {
    strokeDashoffset: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, CIRCULAR_CIRCUMFERENCE],
    }) as unknown as number, 
  };

  return (
    <View style={styles.roundTimer}>
      <Text style={styles.timerText}>
        {Math.floor(duration/1000)}
      </Text>
      <Svg height={40} width={40} viewBox="0 0 100 100">
        <Circle
          cx={stringifiedWidth}
          cy={stringifiedHeight}
          r={String(CIRCLE_RADIUS)}
          stroke={"red"}
          strokeWidth={10}
          fill="red"
        />
        <AnimatedCircle
          cx={stringifiedWidth}
          cy={stringifiedHeight}
          r={String(CIRCLE_RADIUS)}
          stroke="white"
          strokeWidth={20}
          strokeDasharray={CIRCULAR_CIRCUMFERENCE}
          strokeLinecap="butt"
          fill="transparent"
          {...animatedProps}
        />
      </Svg>
    </View>
  );
};

export default TimerPie;
