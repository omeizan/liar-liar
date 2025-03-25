import React, { ReactElement, useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import CustomPicker from "@/components/picker";
import { getStyles } from "../../styles/styles";
import CustomTextInput from "@/components/CustomTextInput";
import CustomImagePicker from "@/components/CustomImagePickert";
import * as Yup from "yup";
import VALUES, { ModalTypes } from "@/constants/Values";
import NotificationManager from "@/utils/NotificationManager";

interface GameModalProps {
  toast: ReactElement;
  modalVisible: string | null;
  setModalVisible: React.Dispatch<ModalTypes>;
  gameCode: string;
  setGameCode: React.Dispatch<React.SetStateAction<string>>;
  createGame: (
    numRounds: number,
    voteTime: number,
    answerTime: number,
    playerName: string,
    photoUri: string
  ) => void;
  joinGame: (name: string, photoUri: string, gameId: string) => void;
}

const GameModal: React.FC<GameModalProps> = ({
  modalVisible,
  setModalVisible,
  gameCode,
  setGameCode,
  createGame,
  joinGame,
}) => {
  const [gameName, setGameName] = useState("");
  const [gamePicture, setGamePicture] = useState("");
  const [rounds, setRounds] = useState<number>(VALUES.NumRounds[0]);
  const [votingTime, setVotingTime] = useState<number>(VALUES.VotingTime[0]);
  const [answerTime, setAnswerTime] = useState<number>(VALUES.AnswerTime[0]);

  useEffect(() => {
    if (modalVisible === null) {
      setGameName("");
      setGamePicture("");
      setRounds(VALUES.NumRounds[0]);
      setVotingTime(VALUES.VotingTime[0]);
      setAnswerTime(VALUES.AnswerTime[0]);
      setGameCode("");
    }
  }, [modalVisible]);

  const styles = getStyles();

  const newGameSchema = Yup.object().shape({
    ownerName: VALUES.Validator("Name", "alphanumeric", true),
    gamePicture: VALUES.Validator("Photo", "string", false),
    rounds: VALUES.Validator("Number of Rounds", "integer", true),
    votingTime: VALUES.Validator("Time to vote", "integer", true),
    answerTime: VALUES.Validator("Time to answer", "integer", true),
  });

  const joinGameSchema = Yup.object().shape({
    participantName: VALUES.Validator("Name", "alphanumeric", true),
    gamePicture: VALUES.Validator("Photo", "string", false),
    gameCode: VALUES.Validator("Game Code", "alphanumeric", true),
  });

  const handleSubmit = async () => {
    try {
      if (modalVisible === VALUES.Modals.CREATE) {
        const values = await newGameSchema.validate(
          {
            ownerName: gameName,
            gamePicture,
            rounds,
            votingTime,
            answerTime,
          },
          { abortEarly: false }
        );
        createGame(rounds, votingTime, answerTime, gameName, gamePicture);
      } else {
        const values = await joinGameSchema.validate(
          {
            participantName: gameName,
            gamePicture,
            gameCode,
          },
          { abortEarly: false }
        );

        joinGame(gameName, gamePicture, gameCode);
      }
    } catch (error) {
      error instanceof Yup.ValidationError
        ? NotificationManager.showErrorToasts(error.inner[0].message)
        : NotificationManager.showErrorToasts(
            VALUES.Messages.DEFAULT_ERROR_MESSAGE
          );
    }
  };

  return (
    <Modal visible={modalVisible !== null} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setModalVisible(null)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
            <View style={styles.modalContent}>
              <View style={styles.modalContentContainer}>
                <Text style={styles.modalTitle}>{modalVisible}</Text>

                <View style={styles.modalForm}>
                  {modalVisible === VALUES.Modals.CREATE && (
                    <>
                      <CustomImagePicker
                        imageUri={gamePicture}
                        setImageUri={setGamePicture}
                      />
                      <CustomTextInput
                        full={false}
                        placeholder="Name"
                        value={gameName}
                        label="Name"
                        multiline={false}
                        onChangeText={setGameName}
                      />

                      <View style={styles.controlRow}>
                        <CustomPicker
                          size="small"
                          label="Rounds"
                          unit=""
                          options={VALUES.NumRounds.map((rounds) => ({
                            text: rounds.toString(),
                            value: rounds.toString(),
                          }))}
                          selectedValue={rounds.toString()}
                          setSelectedValue={(itemValue) =>
                            setRounds(parseInt(itemValue))
                          }
                        />

                        <CustomPicker
                          size="small"
                          label="Voting Time"
                          unit="seconds"
                          options={VALUES.VotingTime.map((votingTime) => ({
                            text: votingTime.toString(),
                            value: votingTime.toString(),
                          }))}
                          selectedValue={votingTime.toString()}
                          setSelectedValue={(itemValue) =>
                            setVotingTime(parseInt(itemValue))
                          }
                        />

                        <CustomPicker
                          size="small"
                          label="Answer time"
                          unit="seconds"
                          options={VALUES.AnswerTime.map((answerTime) => ({
                            text: answerTime.toString(),
                            value: answerTime.toString(),
                          }))}
                          selectedValue={answerTime.toString()}
                          setSelectedValue={(itemValue) =>
                            setAnswerTime(parseInt(itemValue))
                          }
                        />
                      </View>
                    </>
                  )}
                  {modalVisible === VALUES.Modals.JOIN && (
                    <>
                      <CustomImagePicker
                        imageUri={gamePicture}
                        setImageUri={setGamePicture}
                      />

                      <CustomTextInput
                        full={false}
                        placeholder="Game Name"
                        value={gameName}
                        label="Name"
                        multiline={false}
                        onChangeText={setGameName}
                      />
                      <CustomTextInput
                        full={false}
                        placeholder="Game Code"
                        value={gameCode}
                        label="Code"
                        multiline={false}
                        onChangeText={setGameCode}
                      />
                    </>
                  )}

                  {modalVisible === VALUES.Modals.HELP && (
                    <>
                    {VALUES.Tips.map((tip, index) => {
                      return (

                        <Text key={index} style={styles.promptText}>{` ${
                          index + 1
                        }. ${tip}`}</Text>
                      );
                    })}
                    </>
                    )}
                </View>
                {(modalVisible === VALUES.Modals.CREATE ||
                  modalVisible === VALUES.Modals.JOIN || modalVisible === VALUES.Modals.HELP ) && (
                  <View style={styles.modalControls}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(null)}
                      style={[styles.modalControlButton, styles.cancelButton]}
                    >
                      <Text style={styles.modalControlButtonText}>Close</Text>
                    </TouchableOpacity>
                    {(modalVisible === VALUES.Modals.CREATE ||
                  modalVisible === VALUES.Modals.JOIN ) && (
                    <TouchableOpacity
                      style={[
                        (modalVisible === VALUES.Modals.CREATE &&
                          (!gameName ||
                            !rounds ||
                            !votingTime ||
                            !answerTime)) ||
                        (modalVisible === VALUES.Modals.JOIN &&
                          (!gameName || !gameCode))
                          ? styles.modalControlButtonDisabled
                          : styles.modalControlButton,
                      ]}
                      disabled={
                        (modalVisible === VALUES.Modals.CREATE &&
                          (!gameName ||
                            !rounds ||
                            !votingTime ||
                            !answerTime)) ||
                        (modalVisible === VALUES.Modals.JOIN &&
                          (!gameName || !gameCode))
                      }
                      onPress={handleSubmit}
                    >
                      <Text style={styles.modalControlButtonText}>Proceed</Text>
                    </TouchableOpacity>)}
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default GameModal;
