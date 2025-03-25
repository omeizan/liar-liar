import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../firebaseConfig";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function handleApiError(error: any, defaultMessage: string) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.error || defaultMessage);
    } else if (error.request) {
      throw new Error("Network error: Unable to reach the server.");
    }
  }
  throw new Error(defaultMessage);
}

// Uploads profile picture to Firebase Storage
async function uploadPhoto(userId: string, fileUri: string) {
  if (!fileUri || fileUri.trim() === "") return null;

  try {
    const fileExtension = fileUri.split(".").pop() || "jpg";
    const fileName = `profilePictures/${userId}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload profile picture.");
  }
}

// Fetch participant data
export const fetchParticipantData = async (gameId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/game/${gameId}/players`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to fetch participant data.");
  }
};

// Fetch the liar for a given game
export const getLiar = async (gameId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/game/${gameId}/liar`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to fetch liar.");
  }
};

// Fetch the question for a given game
export const getQuestion = async (gameId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/game/${gameId}/question`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to fetch game question.");
  }
};

// Fetch the round question for a specific user
export const getRoundQuestion = async (gameId: string, userId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/game/${gameId}/question/${userId}`);
    return data.question;
  } catch (error) {
    handleApiError(error, "Failed to fetch round question.");
  }
};

// Submit answer for the round
export const sendRoundAnswer = async (gameId: string, userId: string, answer: string) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/game/${gameId}/answer`, {
      userId,
      answer,
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to submit answer.");
  }
};

// Initialize a new game
export const initGame = async (gameData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-game`, gameData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to initialize game.");
  }
};

// Add a player to a game
export const addPlayerToGame = async (player: any, gameId: string) => {
  try {
    const uploadedPhotoURL = await uploadPhoto(player.id, player.photo);

    const playerData = {
      id: player.id,
      name: player.name,
      photo: uploadedPhotoURL,
    };

    const response = await axios.post(`${API_BASE_URL}/join-game/${gameId}`, playerData);
    return response.data;
  } catch (error) {
    //console.log(error)
    handleApiError(error, "Failed to join the game. Please check the game ID.");
  }
};
