import React from "react";
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

interface Participant {
  id: string;
  name: string;
  photo: string;
  roundVotes: number;
  roundScore: number;
  totalScore: number;
  totalVotes: number;
  isOwner: boolean;
}

interface EndGameProps {
  participants: Participant[];
  isOwner: boolean;
  userId: string;
  currentRound: number;
  pushToHome: () => void;
}

const MIN_PARTICIPANTS = 1;

const EndGame: React.FC<EndGameProps> = ({
  participants,
  isOwner,
  userId,
  currentRound,
  pushToHome,
}) => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>Game Over</Text>
      <ScrollView style={styles.participantsList}>
        {participants.sort((a,b)=>{return b.totalScore - a.totalScore}).map((participant, index) => {
        
        const maxScore = Math.max(...participants.map(p => p.totalScore)); 
        const scoreRatio = maxScore > 0 ? participant.totalScore / maxScore : 0; 

        return (
          <View key={participant.id} style={[styles.participantCard]}>
            <View style={[styles.backgroundBar, { width: `${scoreRatio * 100}%` }]} />
            <View style={styles.participantDetails}>
              <Text style={styles.participantName}>{index + 1}</Text>
              <View style={styles.avatar}>
                <Image
                  source={
                    participant.photo
                      ? { uri: participant.photo }
                      : require("../assets/images/default-avatar.png")
                  }
                  style={styles.avatarImage}
                />
                {participant.id === userId && (
                  <Text style={styles.youBadge}>You</Text>
                )}
              </View>

              <View style={styles.participantDetails}>
                <Text style={styles.participantName}>{participant.name}</Text>
              </View>
            </View>
            <Text style={styles.participantName}>{participant.totalScore}</Text>
          </View>
        )})}
      </ScrollView>
      {
        <View style={styles.modalControls}>
          
            <TouchableOpacity
              style={styles.modalControlButton}

              onPress={pushToHome}
            >
              <Text
                style={styles.modalControlButtonText}
              >{`Return Home`}</Text>
            </TouchableOpacity>
        
        </View>
      }
    </View>
  );
};

export default EndGame;
