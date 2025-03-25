import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { getStyles } from "@/styles/styles";
import { fetchParticipantData, getLiar } from "@/utils/APIUtils";
import Toast from "react-native-toast-message";
import toastConfig from "@/styles/toastConfig";

import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Share,
} from "react-native";
import { useSocket } from "@/hooks/useSocket";
import Lobby from "@/components/Lobby";
import Answering from "@/components/Answering";
import Voting from "@/components/Voting";
import Results from "@/components/Results";
import EndGame from "@/components/EndGame";
import NotificationManager from "@/utils/NotificationManager";
import VALUES from "@/constants/Values";
import LoadingScreen from "@/components/Loading";

export default function JoinGameScreen() {
  const { id } = useLocalSearchParams();
  const [isParticipant, setIsParticipant] = useState<null | boolean>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [gameNotFound, setGameNotFound] = useState(false);
  const router = useRouter();
  const styles = getStyles();

  const { socket, isConnected, userId, isLoading } = useSocket();

  useEffect(() => {
    const checkIfParticipant = async () => {
      if (isLoading) return;

      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts("Error loading Page");
        pushToHome();
        return;
      }

      try {
        const data = await fetchParticipantData(id);
        if (!data) {
          setGameNotFound(true);
          NotificationManager.showErrorToasts(
            "Game not found! Returning you home..."
          );
          pushToHome();
          return;
        }

        const participant = data.participants.find(
          (participant: any) => participant.id === userId
        );

        if (!participant) {
          pushToJoinGame();
          setIsParticipant(false);
        } else {
          setIsParticipant(true);
          setIsOwner(participant.isOwner);
          pushToGame();
          if (socket && isConnected) {
            socket.emit("enteredGame", { gameId: id, userId });
          }
        }
      } catch (error) {
        //console.log(error);
        setGameNotFound(true);
        pushToHome();
      }
    };

    checkIfParticipant();
  }, [id, userId, isLoading, socket, isConnected]);

  const pushToHome = () => {
    setTimeout(() => {
      router.replace("/");
    }, 4000);
  };

  const pushToJoinGame = () => {
    if (!id || Array.isArray(id)) {
      NotificationManager.showErrorToasts("Error loading Page");
      pushToHome();
      return;
    }
    setTimeout(() => {
      router.replace(`/?inviteCode=${id}`);
    }, 3000);
  };

  const pushToGame = () => {
    if (!id || Array.isArray(id)) {
      NotificationManager.showErrorToasts("Error loading Page");
      pushToHome();
      return;
    }
    setTimeout(() => {
      router.replace(`/game/${id}`);
    }, 3000);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <LoadingScreen />
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }

  if (gameNotFound) {
    NotificationManager.showErrorToasts(
      "Something went wrong! Sending you home."
    );
    pushToHome();
    return (
      <ThemedView style={styles.container}>
        <LoadingScreen />
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }

  if (isParticipant === null) {
    return (
      <>
        <LoadingScreen />
        <Toast config={toastConfig} />
      </>
    );
  }

  if (!isParticipant) {
    pushToJoinGame();
    return (
      <ThemedView style={styles.container}>
        <LoadingScreen />
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LoadingScreen />
      <Toast config={toastConfig} />
    </ThemedView>
  );
}
