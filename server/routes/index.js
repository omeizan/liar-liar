import express from "express"; // Import express
const router = express.Router();

import { db } from "../firebase.js";

import {Timestamp } from "firebase-admin/firestore";

/* GET home page. */

const MAX_PLAYERS = 8;


router.get("/api", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/game/:gameId/question/:userId", async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    const gameRef = db.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }

    const gameData = gameDoc.data();
    const player = gameData.gameData.participants.find((p) => p.id === userId);

    if (!player) {
      return res.status(404).json({ error: "Player not found in the game" });
    }
    //console.log({ question: player.roundQuestion })
    return res.json({ question: player.roundQuestion });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

router.post("/api/game/:gameId/answer", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, answer } = req.body;

    const gameRef = db.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ error: "Game not found" });
    }

    const gameData = gameDoc.data();
    const playerIndex = gameData.gameData.participants.findIndex((p) => p.id === userId);

    if (playerIndex === -1) {
      return res.status(404).json({ error: "Player not found in the game" });
    }

    gameData.gameData.participants[playerIndex].roundAnswer = answer;
    await gameRef.update({ "gameData.participants": gameData.gameData.participants });

    res.json({ message: "Answer submitted successfully" });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

router.post("/api/create-game", async (req, res) => {
  const gameData = {
    createdAt:Timestamp.now(),
    numRounds: req.body.numRounds || 5,
    voteTime: req.body.voteTime || 30,
    answerTime: req.body.answerTime || 60,
    participants: [],
    gameStage: "waiting",
    roundEndsIn:-1,
    owner: req.body.owner,
    currentRound: 1,
    liar:"",
    roundQuestion:"",
    roundVotes:{}
  };
  try {
    const gameRef = db.collection("games").doc();
    await gameRef.set({
      gameData
    });
    res.status(201).json({ gameId: gameRef.id });
  } catch (error) {
    console.error("Error creating game:", error);
    res
      .status(500)
      .json({ error: "Error creating game : Internal server error" });
  }
});
router.post("/api/join-game/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  const { name, photo, id } = req.body; 

  // Reference to the game document in Firestore
  const gameRef = db.collection("games").doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) {
    return res.status(404).json({ error: "Game not found!" });
  }

  const game = gameDoc.data();

  if (!game.gameData || !Array.isArray(game.gameData.participants)) {
    return res.status(400).json({ error: "Invalid game data structure." });
  }

  const isParticipantExists = game.gameData.participants.some(p => p.id === id);

  if (isParticipantExists) {
    return res.status(200).json({ error: "Player already in the game." });
  }

  if(game.gameData.participants > MAX_PLAYERS){
    return res.status(400).json({ error: "This game is already full." });
  }

  // Check if the participant is the owner
  const isOwner = game.gameData.owner === id;

  // Add participant with isOwner status
  game.gameData.participants.push({
    name,
    photo,
    id,
    roundVotes:0,
    roundScore:0,
    totalScore:0,
    totalVotes:0,
    roundQuestion:"",
    roundAnswer:"",
    isOwner, 
  });

  try {
    await gameRef.update({
      "gameData.participants": game.gameData.participants
    });
    res.status(200).json({ message: "Joined the game" });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Error joining the game: Internal server error" });
  }
});

router.get("/api/game/:gameId/players", async (req, res) => {
  const gameId = req.params.gameId;

  // Reference to the game document in Firestore
  const gameRef = db.collection("games").doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) {
    return res.status(404).json({ error: "Game not found!" });
  }

  const game = gameDoc.data();

  if (!game.gameData || !Array.isArray(game.gameData.participants)) {
    return res.status(400).json({ error: "Invalid game data structure." });
  }

  // Map participants to return only required fields
  const participants = game.gameData.participants.map(p => ({
    name:p.name,
    id: p.id,
    photo: p.photo,
    roundVotes: p.roundVotes,
    roundScore:p.roundScore,
    totalScore:p.totalScore,
    totalVotes:p.totalVotes,
    isOwner: p.isOwner,
    roundQuestion:p.roundQuestion,
    roundAnswer:p.roundAnswer,
  }));

  res.status(200).json({ participants });
});

router.get("/api/game/:gameId/liar", async (req, res) => {
  const gameId = req.params.gameId;

  // Reference to the game document in Firestore
  const gameRef = db.collection("games").doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) {
    return res.status(404).json({ error: "Game not found!" });
  }

  const game = gameDoc.data();

  if (!game.gameData || !Array.isArray(game.gameData.participants)) {
    return res.status(400).json({ error: "Invalid game data structure." });
  }

  const liar = game.gameData.liar

  res.status(200).json({ liar });
});

router.get("/api/game/:gameId/question", async (req, res) => {
  const gameId = req.params.gameId;

  // Reference to the game document in Firestore
  const gameRef = db.collection("games").doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) {
    return res.status(404).json({ error: "Game not found!" });
  }

  const game = gameDoc.data();

  if (!game.gameData || !Array.isArray(game.gameData.participants)) {
    return res.status(400).json({ error: "Invalid game data structure." });
  }

  const question = game.gameData.roundQuestion

  res.status(200).json({ question });
});


export default router;
