import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getStyles } from "../../styles/styles";
import GameModal from "./gameModal";
import { initGame, addPlayerToGame } from "@/utils/APIUtils";
import { useSocket } from "@/hooks/useSocket";
import Toast from "react-native-toast-message";
import toastConfig from "../../styles/toastConfig";
import VALUES, { ModalTypes } from "../../constants/Values";
import CustomLargeButton from "@/components/CustomLargeButton";
import NotificationManager from "@/utils/NotificationManager";

export default function HomeScreen() {
  const styles = getStyles();
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");

  const { userId } = useSocket();

  const [modalVisible, setModalVisible] = useState<ModalTypes>(null);
  const { inviteCode } = useLocalSearchParams();

  useEffect(() => {

    

    if (inviteCode) {
      setModalVisible(VALUES.Modals.JOIN); 
      setGameCode(inviteCode as string);
    }
  }, []);




  function createGame(
    numRounds: number,
    voteTime: number,
    answerTime: number,
    playerName: string,
    photoUri: string
  ) {
    const gameData = {
      numRounds: numRounds,
      voteTime: voteTime,
      answerTime: answerTime,
      participants: [],
      liar: "",
      owner: userId,
      gameStage: VALUES.GameStates.WAITING,
      currentRound: 0,
    };
    setModalVisible(null);
    handleCreateGame(gameData, playerName, photoUri);
  }

  const handleCreateGame = async (
    gameData: any,
    playerName: string,
    photoUri: string
  ) => {
    try {
      const result = await initGame(gameData);
      NotificationManager.showSuccessToasts(VALUES.Messages.CREATED_GAME);
      joinGame(playerName, photoUri, result.gameId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : VALUES.Messages.DEFAULT_ERROR_MESSAGE;
      NotificationManager.showErrorToasts(errorMessage);
    }
  };

  function joinGame(playerName: string, photoURL: string, gameId: string) {
    const playerData = {
      id: userId,
      name: playerName,
      photo: photoURL,
    };
    setModalVisible(null);
    handleJoinGame(playerData, gameId);
  }

  const handleJoinGame = async (playerData: any, gameId: string) => {
    try {
      NotificationManager.showProcessingToasts(VALUES.Messages.ENTERING_GAME);
      await addPlayerToGame(playerData, gameId);
      goToGame(gameId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : VALUES.Messages.DEFAULT_ERROR_MESSAGE;
      NotificationManager.showErrorToasts(errorMessage);
    }
  };

  const goToGame = (gameId: string) => {
    setTimeout(() => {
      router.replace(`/game/${gameId}`);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />
      <View style={styles.buttonRow}>
        <CustomLargeButton
          label={VALUES.Modals.CREATE}
          icon={VALUES.Icons.NEW}
          onPress={() => {setModalVisible(VALUES.Modals.CREATE)}}
        />
        <CustomLargeButton
          label={VALUES.Modals.JOIN}
          icon={VALUES.Icons.JOIN}
          onPress={() => setModalVisible(VALUES.Modals.JOIN)}
        />
        <CustomLargeButton
          label={VALUES.Modals.HELP}
          icon={VALUES.Icons.HELP}
          onPress={() => setModalVisible(VALUES.Modals.HELP)}
        />
      </View>

      <GameModal
        toast={<Toast config={toastConfig} />}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        gameCode={gameCode}
        setGameCode={setGameCode}
        createGame={createGame}
        joinGame={joinGame}
      ></GameModal>
      <Toast config={toastConfig} />
    </View>
  );
}
