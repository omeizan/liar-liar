import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { getStyles } from "@/styles/styles";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

// Interfaces
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

interface ResultProps {
  participants: Participant[];
  isOwner: boolean;
  userId: string;
  endsIn: number;
  currentRound: number;
  castVote: (votee: string, id: string) => void;
  fetchLiar: () => Promise<string>;
  advanceGame: () => void;
}

const Results: React.FC<ResultProps> = ({
  participants,
  isOwner,
  userId,
  currentRound,
  endsIn,
  castVote,
  fetchLiar,
  advanceGame,
}) => {
  const styles = getStyles();
  const [votee, setVotee] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(endsIn - Date.now());
  const [statusText, setStatusText] = useState("Select to Vote");
  const [liarId, setLiarId] = useState("");
  const [showAdvanceButton, setShowAdvanceButton] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResults = async () => {
      setStatusText("The votes are in...");
      const roundLiar = fetchLiar();
      setLiarId(await roundLiar);
      //console.log("liarId", liarId);
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setStatusText("And the liar is...");
      const interval = setInterval(() => {
        setHighlightedIndex((prevIndex) =>
          prevIndex === null || prevIndex >= participants.length - 1
            ? 0
            : prevIndex + 1
        );
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setHighlightedIndex(participants.findIndex((p) => p.id === liarId));
        setShowAdvanceButton(true);
      }, 5000);
    };

    handleResults();
  }, [liarId,userId,]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{statusText}</Text>

      {/* Grid Layout for Avatars */}
      <View style={styles.participantsGrid}>
        {participants.map((participant, index) => (
          <View style={[ styles.resultAvatar , highlightedIndex === index && styles.liarAvatar]}>
            <Image
              source={
                participant.photo
                  ? { uri: participant.photo }
                  : require("../assets/images/default-avatar.png")
              }
              style={styles.avatarImage}
            />
            <Text style={styles.buttonText}>{participant.name}</Text>
            <Text style={styles.roundVotes}>{participant.roundVotes}</Text>
            {participant.id === userId && (
              <Text style={styles.youBadge}>You</Text>
            )}
          </View>
        ))}
      </View>

      {showAdvanceButton &&  (
        <TouchableOpacity style={[styles.modalControlButton, !isOwner && styles.modalControlButtonDisabled]} onPress={advanceGame}>
          {<Text style={styles.buttonText}>{isOwner ? "Go to next round" : "Waiting for next Round" }</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Results;
