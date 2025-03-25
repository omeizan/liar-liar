import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getStyles } from "@/styles/styles";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { getLiar, getQuestion } from "@/utils/APIUtils";

interface Participant {
  id: string;
  name: string;
  photo: string;
  roundVotes: number;
  roundScore: number;
  totalScore: number;
  totalVotes: number;
  roundAnswer: string;
  roundQuestion: string;
  isOwner: boolean;
}

interface VotingProps {
  participants: Participant[];
  isOwner: boolean;
  gameId: string;
  userId: string;
  endsIn: number;
  currentRound: number;
  castVote: (votee: string) => void;
}

const MIN_PARTICIPANTS = 1;

const Voting: React.FC<VotingProps> = ({
  participants,
  isOwner,
  userId,
  currentRound,
  endsIn,
  gameId,
  castVote,
}) => {
  const styles = getStyles();
  const [votee, setVotee] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(endsIn - Date.now());
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const roundQuestion = await getQuestion(gameId);
        setQuestion(roundQuestion.question);
      } catch (err) {
        setError("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [gameId, userId, endsIn]);

  return (
    <View style={styles.container}>
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
      <Text style={styles.buttonText}>Select to Vote</Text>
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
      <ScrollView style={styles.participantsList}>
        {participants
          .filter((participant) => participant.id !== userId)
          .map((participant, index) => (
            <TouchableOpacity
              key={participant.id}
              style={[
                styles.votingCard,
                votee === participant.id && styles.selectedParticipantCard,
              ]}
              onPress={() => {
                castVote(participant.id);
                setVotee(participant.id);
              }}
            >
              <View style={styles.avatar}>
                <Image
                  source={
                    participant.photo
                      ? { uri: participant.photo }
                      : require("../assets/images/default-avatar.png")
                  }
                  style={styles.avatarImage}
                />
                <Text style={styles.buttonText}>{participant.name}</Text>
              </View>
              {participant.roundAnswer && (
                <View style={styles.bubbleContainer}>
                  <View style={styles.chatBubble}>
                    <Text style={styles.bubbleText}>
                      {participant.roundAnswer}
                    </Text>
                  </View>
                  <View style={styles.bubbleTail} />
                </View>
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Voting;
