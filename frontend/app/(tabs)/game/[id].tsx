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
  Alert,
} from "react-native";
import { useSocket } from "@/hooks/useSocket";
import Lobby from "@/components/Lobby";
import Answering from "@/components/Answering";
import Voting from "@/components/Voting";
import Results from "@/components/Results";
import EndGame from "@/components/EndGame";
import NotificationManager from "@/utils/NotificationManager";
import VALUES from "@/constants/Values";

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const [isParticipant, setIsParticipant] = useState<null | boolean>(null);
  const [participants, setParticipants] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [gameNotFound, setGameNotFound] = useState(false);
  const [gameState, setGameState] = useState<string | null>(null); // Store game state
  const [round, setRound] = useState<number>(0);
  const [roundEndsIn, setRoundEndsIn] = useState<number>(-1);
  const router = useRouter();
  const styles = getStyles();

  const { socket, isConnected, userId, isLoading } = useSocket();

  const getParticipants = async () => {
    try {
      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        pushToHome();
        return;
      }

      const data = await fetchParticipantData(id);

      if (!data) {
        setGameNotFound(true);
        NotificationManager.showErrorToasts(VALUES.Messages.GAME_NOT_FOUND)
        pushToHome();
        return;
      }

      setParticipants(data.participants);
    } catch (error) {
      NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
      pushToHome();
    }
  };


  const handleEndOrLeave = () => {

    if(Platform.OS === "web" ){
      const confirmLeave = window.confirm("Are you sure you want to leave the game? This will end your current session.");

      if (confirmLeave) {

        if (socket && isConnected) {
          if (!id || Array.isArray(id)) {
            NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
            pushToHome();
            return;
          }

        socket.emit("leaveGame", { gameId: id, userId }, (response: any) => {
        });
       }

      } else {

        //console.log("Leave action canceled");
      }
    }

    Alert.alert(
      "Are you sure?", 
      "Are you sure you want to leave the game? This will end your current session.", 
      [
        {
          text: "Cancel", 
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK", 
          onPress: () => {

            if (socket && isConnected) {
              if (!id || Array.isArray(id)) {
                NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
                pushToHome();
                return;
              }
  
            socket.emit("leaveGame", { gameId: id, userId }, (response: any) => {
            });
           }
          }
        }
      ],
      { cancelable: false }
    );
  };
  

  const advanceGame = () => {
    if (socket && isConnected) {
      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        pushToHome();
        return;
      }
      socket.emit("advance", { gameId: id, userId }, (response: any) => {
        //console.log("Server Response:", response);
      });
    } else {
      //console.log("Socket is not connected");
    }
  };

  const  castVote = (votee: string) => {
    if (socket && isConnected) {
      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        pushToHome();
        return;
      }
      socket.emit("castVote", { gameId: id, userId, voteeId : votee }, (response: any) => {
        //console.log("Server Response:", response);
      });
    } else {
    }
  }
  

  useEffect(() => {
    const checkIfParticipant = async () => {
      if (isLoading) return;

      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        pushToHome();
        return;
      }

      try {
        const data = await fetchParticipantData(id);
        if (!data) {
          setGameNotFound(true);
          NotificationManager.showErrorToasts(VALUES.Messages.GAME_NOT_FOUND)
          pushToHome();
          return;
        }

        const participant = data.participants.find(
          (participant: any) => participant.id === userId
        );

        if (!participant) {
            NotificationManager.showErrorToasts(VALUES.Messages.NO_PERMISSION)
          pushToHome();
          setIsParticipant(false);
        } else {
          setIsParticipant(true);
          setIsOwner(participant.isOwner);
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
    getParticipants();

    if (socket && isConnected) {
      socket.on("gameStateUpdate", (newGameState: any) => {
        //console.log(Date.now());
        //console.log(newGameState); // Set the received game state to state
        setGameState(newGameState.gameStage);
        setRound(newGameState.currentRound);
        setRoundEndsIn(newGameState.roundEndsIn || -1);
        getParticipants();
      });

      return () => {
        if (socket) {
          socket.off("gameStateUpdate");
        }
      };
    }
  }, [id, userId, isLoading, socket, isConnected]);

  const pushToHome = () => {
    NotificationManager.showProcessingToasts(VALUES.Messages.RETURN_HOME)
    setTimeout(() => {
      router.replace("/");
    }, 3000);
  };



  const fetchLiar = async (): Promise<string> => {
    try {
      if (!id || Array.isArray(id)) {
        NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        pushToHome();
        return "";
      }
  
      const data = await getLiar(id);
  
      if (!data) {
        setGameNotFound(true);
        NotificationManager.showErrorToasts(VALUES.Messages.GAME_NOT_FOUND)
        pushToHome();
        return "";
      }
      //console.log(data)
      return data.liar;
    } catch (error) {
      console.error("Error fetching participants:", error);
      NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
      pushToHome();
      return "";
    }
  };
  

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Text>Loading...</Text>
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }

  if (gameNotFound) {
    NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
    pushToHome();
    return (
      <ThemedView style={styles.container}>
        <Text>Loading...</Text>
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }


  const handleInvite = () => {
    if (!id || Array.isArray(id)) {
      NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
      pushToHome();
      return;
    }

    const inviteUrl = `${process.env.EXPO_PUBLIC_APP_URL}/joinGame/${id}`;
  
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(inviteUrl)
        .then(() => {
          NotificationManager.showSuccessToasts("Link Copied")
        })
        .catch((err) => {
          NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE)
        });
    } else {
      Share.share({
        message: inviteUrl,
      })
        .catch((error) => NotificationManager.showErrorToasts(VALUES.Messages.DEFAULT_ERROR_MESSAGE))
    }
  };

  if (isParticipant === null) {
    return (
      <ThemedView style={styles.container}>
        <Text>Loading...</Text>
        <Toast config={toastConfig} />
      </ThemedView>
    );
  }

  if (!isParticipant) {
    return (
      <>
        <Stack.Screen options={{ title: "Oops!" }} />
        <ThemedView style={styles.container}>
          <ThemedText type="title">This screen doesn't exist.</ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link>
          <Toast config={toastConfig} />
        </ThemedView>
      </>
    );
  }

  // Render different components based on gameState
  const renderGameStateComponent = () => {
    if (gameState === "waiting") {
      return (
        <ThemedView style={styles.container}>
          <Lobby
            participants={participants}
            isOwner={isOwner}
            userId={userId}
            currentRound={round}
            advanceGame={advanceGame}
            handleEndOrLeave={handleEndOrLeave}
            handleInvite={handleInvite}
          />
          <Toast config={toastConfig} />
        </ThemedView>
      );
    }

    if (gameState === "answering") {
      return (
        <ThemedView style={styles.container}>
          <Answering
            gameId={!id || Array.isArray(id) ? "" : id}
            userId={userId}
            endsIn={roundEndsIn}
            currentRound={round}
          />
          <Toast config={toastConfig} />
        </ThemedView>
      );
    }

    if (gameState === "voting") {
      return (
        <ThemedView style={styles.container}>
          <Voting
            gameId={!id || Array.isArray(id) ? "" : id}
            participants={participants}
            isOwner={isOwner}
            userId={userId}
            endsIn={roundEndsIn}
            currentRound={round}
            castVote={castVote}
          />
          <Toast config={toastConfig} />
        </ThemedView>
      );
    }

    if (gameState === "revealing") {
      return (
        <ThemedView style={styles.container}>
          <Results
            participants={participants}
            isOwner={isOwner}
            userId={userId}
            endsIn={roundEndsIn}
            currentRound={round}
            advanceGame={advanceGame}
            castVote={castVote}
            fetchLiar={fetchLiar}
            
          />
          <Toast config={toastConfig} />
        </ThemedView>
      );
    }

    if (gameState === "ended") {
      return (
        <ThemedView style={styles.container}>
          <EndGame
            participants={participants}
            isOwner={isOwner}
            userId={userId}
            currentRound={round}
            pushToHome={pushToHome}
          />
          <Toast config={toastConfig} />
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.container}>
        <Text style={styles.defaultText}>Waiting for game state...</Text>
        <Toast config={toastConfig} />
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mainContent}>
        {renderGameStateComponent()} {/* Render based on game state */}
      </View>
    </ThemedView>
  );
}
