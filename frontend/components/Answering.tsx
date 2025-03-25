import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Touchable,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { getRoundQuestion, sendRoundAnswer } from "../utils/APIUtils";
import { getStyles } from "@/styles/styles";
import CustomTextInput from "./CustomTextInput";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Toast from "react-native-toast-message";
import toastConfig from "@/styles/toastConfig";

interface AnsweringProps {
  gameId: string;
  userId: string;
  endsIn: number;
  currentRound: number;
}

const MAX_ANSWER_LENGTH = 50;

const Answering: React.FC<AnsweringProps> = ({
  gameId,
  userId,
  endsIn,
  currentRound,
}) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(endsIn - Date.now());

  const styles = getStyles();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const roundQuestion = await getRoundQuestion(gameId, userId);
        setQuestion(roundQuestion);
      } catch (err) {
        setError("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [gameId, userId, endsIn]);

  const showSuccessToasts = (message: string) => {
    Toast.show({
      type: "success",
      text1: "",
      text2: message,
      position:"bottom"
    });
  };

  const showErrorToasts = (message: string) => {
    Toast.show({
      type: "error",
      text1: "",
      text2: message,
      position:"bottom"
    });
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    try {
      await sendRoundAnswer(gameId, userId, answer);
      setSubmitted(true);
      Keyboard.dismiss();
      showSuccessToasts("Answer Sent");
    } catch (err) {
        Keyboard.dismiss();
       showErrorToasts("Failed to submit answer.");
       
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={{ color: "red" }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{`Round ${currentRound}`}</Text>
      <Text style={styles.buttonText}>Answer the Question</Text>
      {question ? (
        <View style={styles.bubbleContainer}>
          <View style={styles.chatBubble}>
            <Text style={styles.bubbleText}>{question}</Text>
          </View>
          <View style={styles.bubbleTail} />
        </View>
      ) : (
        <Text style={styles.warningText}>No question available.</Text>
      )}

      <View style={styles.roundTimer}>
        <CountdownCircleTimer
          isPlaying
          duration={Math.max(timeLeft / 1000, 0)}
          colors={["#00FF00", "#00FF00", "#A30000", "#A30000"]}
          colorsTime={[30, 15, 5, 0]}
          onComplete={() => ({ shouldRepeat: false, delay: 1000 })}
          size={80}
        >
          {({ remainingTime, color }) => (
            <Text style={styles.timerText}>{remainingTime}</Text>
          )}
        </CountdownCircleTimer>
      </View>

      <>
        <CustomTextInput
          style={styles.largeTextInput}
          placeholder="Type your answer..."
          value={answer}
          multiline={false}
          onChangeText={setAnswer}
          label={"Answer"}
          full={true}
          maxLength={MAX_ANSWER_LENGTH}
        />
        <TouchableOpacity
          style={[
            styles.modalControlButton,
            !answer.trim() && styles.modalControlButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!answer.trim()}
        >
          <Text style={styles.optionText}>SEND</Text>
        </TouchableOpacity>
      </>
      <Toast config={toastConfig} />
    </View>
  );
};

export default Answering;
