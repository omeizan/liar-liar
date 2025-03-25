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
import VALUES from "@/constants/Values";

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

interface LobbyProps {
  participants: Participant[];
  isOwner: boolean;
  userId: string;
  currentRound: number;
  advanceGame: () => void;
  handleEndOrLeave: () => void;
  handleInvite: () => void;
}

const Lobby: React.FC<LobbyProps> = ({
  participants,
  isOwner,
  userId,
  currentRound,
  advanceGame,
  handleEndOrLeave,
  handleInvite,
}) => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Lobby</Text>
      <View style={styles.participantsList}>
        {participants
          .sort((a, b) => {
            return b.totalScore - a.totalScore;
          })
          .map((participant, index) => {
            const maxScore = Math.max(...participants.map((p) => p.totalScore));
            const scoreRatio =
              maxScore > 0 ? participant.totalScore / maxScore : 0;

            return (
              <View key={participant.id} style={[styles.participantCard]}>
                <View
                  style={[
                    styles.backgroundBar,
                    { width: `${scoreRatio * 100}%` },
                  ]}
                />
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
                    <Text style={styles.participantName}>
                      {participant.name}
                    </Text>
                  </View>
                </View>
                <Text style={styles.participantName}>
                  {participant.totalScore}
                </Text>
              </View>
            );
          })}
      </View>
      {
        <Text
          style={styles.optionText}
        >{`Players : ${participants.length} `}</Text>
      }

      {(participants.length < VALUES.MIN_PLAYERS ||
        participants.length > VALUES.MAX_PLAYERS) && (
        <Text
          style={styles.warningText}
        >
          {(participants.length < VALUES.MIN_PLAYERS) && (`Required Players : ${VALUES.MIN_PLAYERS}`)}
          {(participants.length > VALUES.MAX_PLAYERS) && (`Maximum Players : ${VALUES.MAX_PLAYERS}`)}
        </Text>
      )}
      {
        <View style={styles.centralModalControls}>
          <>
            {isOwner && (
              <TouchableOpacity
                style={styles.modalControlButton}
                onPress={handleInvite}
              >
                <Text
                  style={styles.modalControlButtonText}
                >{`Invite Players`}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={
                participants.length < VALUES.MIN_PLAYERS ||
                participants.length > VALUES.MAX_PLAYERS ||
                !isOwner
                  ? styles.modalControlButtonDisabled
                  : styles.modalControlButton
              }
              disabled={
                participants.length < VALUES.MIN_PLAYERS ||
                participants.length > VALUES.MAX_PLAYERS ||
                !isOwner
              }
              onPress={advanceGame}
            >
              <Text style={styles.modalControlButtonText}>{`${
                isOwner ? "Begin" : "Waiting for"
              } Round ${currentRound}`}</Text>
            </TouchableOpacity>
          </>

          <TouchableOpacity
            style={[styles.modalControlButton, styles.cancelButton]}
            onPress={handleEndOrLeave}
          >
            <Text style={styles.modalControlButtonText}>{`${
              isOwner ? "End" : "Leave"
            } Game`}</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
};

export default Lobby;
