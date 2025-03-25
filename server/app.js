import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Server as socketIo } from "socket.io";
import indexRouter from "./routes/index.js";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { db } from "./firebase.js";

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const application = express();
const appServer = createServer(application); // Create HTTP server

// Attach Socket.io to appServer
const io = new socketIo(appServer, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

// Apply CORS for Express too
application.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

application.use(logger("dev"));
application.use(express.json());
application.use(express.urlencoded({ extended: false }));
application.use(cookieParser());
application.use(express.static(path.join(__dirname, "public")));

application.use("/", indexRouter);

let userSocketMap = {}; // Stores userId -> socket mapping
let games = {}; // Stores game states by gameId

const getGameState = async (gameId) => {
  if (!gameId || typeof gameId !== "string" || gameId.trim() === "") {
    console.warn(
      "getGameState called with an empty or invalid gameId:",
      gameId
    );
    return null; // Avoid querying Firestore with invalid input
  }

  //console.log("Fetching game state for gameId:", gameId);
  const gameRef = db.collection("games").doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) {
    console.warn(`Game document not found for gameId: ${gameId}`);
    return null;
  }

  const game = gameDoc.data();
  if (!game.gameData || !Array.isArray(game.gameData.participants)) {
    console.warn(`Invalid game data structure for gameId: ${gameId}`);
    return null;
  }

  games[gameId] = game.gameData;
  return games[gameId];
};


io.on("connection", (socket) => {
  //console.log(`User connected: ${socket.id}`);

  socket.emit("welcome", { message: "Welcome to the WebSocket server!" });

  socket.on("setUserId", (userId) => {
    userSocketMap[userId] = {
      socketId: socket.id,
      isConnected: true,
    };
    //console.log(`User ID ${userId} for socket ${socket.id}`);
  });

  socket.on("enteredGame", async ({ gameId, userId }) => {
    const game = await getGameState(gameId);
    if (!game) {
      return socket.emit("error", { message: "Game not found" });
    }

    socket.join(gameId);
    //console.log(`${userId} joined room: ${gameId}`);

    let gameStage = game.gameStage;
    let currentRound = game.currentRound;
    let roundEndsIn = game.roundEndsIn;

    io.to(gameId).emit("gameStateUpdate", {
      gameStage,
      currentRound,
      roundEndsIn,
    });
  });

  socket.on("leaveGame", async ({ gameId, userId }) => {
    const game = await getGameState(gameId);
    if (!game) {
      return socket.emit("error", { message: "Game not found" });
    }

    let gameStage = game.gameStage;
    let currentRound = game.currentRound;
    let roundEndsIn = game.roundEndsIn;
    if (game.owner == userId) {
      gameStage = "ended";
      roundEndsIn = -1;
    } else {
      const gameRef = db.collection("games").doc(gameId);
      const gameDoc = await gameRef.get();

      if (!gameDoc.exists) return;

      const game = gameDoc.data();
      if (!game.gameData || !Array.isArray(game.gameData.participants)) return;

      const participants = game.gameData.participants;

      const updatedParticipants = participants.filter((p) => p.id !== userId);

      await gameRef.update({
        "gameData.participants": updatedParticipants,
      });
    }

    await db.collection("games").doc(gameId).update({
      "gameData.gameStage": gameStage,
      "gameData.currentRound": currentRound,
      "gameData.roundEndsIn": roundEndsIn,
    });

    io.to(gameId).emit("gameStateUpdate", {
      gameStage,
      currentRound,
      roundEndsIn,
    });

    socket.leave(gameId);
    //console.log(`${userId} left room: ${gameId}`);
  });

  socket.on("castVote", async ({ gameId, userId, voteeId }) => {
    //console.log({ gameId, userId, voteeId });
    const gameRef = db.collection("games").doc(gameId);
    const gameSnap = await gameRef.get();
    const game = gameSnap.data();

    if (!game || !game.gameData || game.gameData.participants.length < 1)
      return;

    const participants = game.gameData.participants;
    const roundVotes = game.gameData.roundVotes || {};

    roundVotes[userId] = voteeId;

    const updatedParticipants = participants.map((p) => ({
      ...p,
      roundVotes: Object.values(roundVotes).filter((v) => v === p.id).length,
    }));

    await gameRef.update({
      "gameData.roundVotes": roundVotes,
      "gameData.participants": updatedParticipants,
    });
  });

  socket.on("advance", async ({ gameId, userId }) => {
    //console.log("Advance request received:", { gameId, userId });

    if (!gameId || typeof gameId !== "string" || gameId.trim() === "") {
      console.warn("advance called with an empty or invalid gameId:", gameId);
      return socket.emit("error", { message: "Invalid gameId" });
    }

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.warn("advance called with an empty or invalid userId:", userId);
      return socket.emit("error", { message: "Invalid userId" });
    }

    const game = await getGameState(gameId);
    if (!game) {
      return socket.emit("error", { message: "Game not found" });
    }

    if (game.owner !== userId) {
      console.warn(
        `Unauthorized advance attempt by user ${userId} for gameId: ${gameId}`
      );
      return socket.emit("error", { message: "Not authorized" });
    }

    if (!gameId || !userId) return;

    if (!game) {
      return socket.emit("error", { message: "Game not found" });
    }

    if (game.owner !== userId) {
      return socket.emit("error", { message: "Not authorized" });
    }

    let gameStage = game.gameStage;
    let currentRound = game.currentRound;
    let roundEndsIn = -1;

    if (gameStage === "waiting") {
      await assignLiarAndQuestions(gameId);
      gameStage = "answering";
      roundEndsIn = Date.now() + game.answerTime * 1000;

      await db.collection("games").doc(gameId).update({
        "gameData.gameStage": gameStage,
        "gameData.currentRound": currentRound,
        "gameData.roundEndsIn": roundEndsIn,
      });

      io.to(gameId).emit("gameStateUpdate", {
        gameStage,
        currentRound,
        roundEndsIn,
      });

      setTimeout(async () => {
        gameStage = "voting";
        roundEndsIn = Date.now() + game.voteTime * 1000;

        await db.collection("games").doc(gameId).update({
          "gameData.gameStage": gameStage,
          "gameData.currentRound": currentRound,
          "gameData.roundEndsIn": roundEndsIn,
        });

        io.to(gameId).emit("gameStateUpdate", {
          gameStage,
          currentRound,
          roundEndsIn,
        });

        setTimeout(async () => {
          gameStage = "revealing";
          roundEndsIn = -1;
          await db.collection("games").doc(gameId).update({
            "gameData.gameStage": gameStage,
            "gameData.currentRound": currentRound,
            "gameData.roundEndsIn": roundEndsIn,
          });

          io.to(gameId).emit("gameStateUpdate", {
            gameStage,
            currentRound,
            roundEndsIn,
          });
        }, game.voteTime * 1000);
      }, game.answerTime * 1000);
    } else if (gameStage === "revealing") {
      await calculateScore(gameId);
      gameStage = currentRound === game.numRounds ? "ended" : "waiting";
      currentRound =
        currentRound === game.numRounds ? currentRound : currentRound + 1;
      roundEndsIn = -1;

      await db.collection("games").doc(gameId).update({
        "gameData.gameStage": gameStage,
        "gameData.currentRound": currentRound,
        "gameData.roundEndsIn": roundEndsIn,
      });

      io.to(gameId).emit("gameStateUpdate", {
        gameStage,
        currentRound,
        roundEndsIn,
      });
    } else {
      return socket.emit("error", { message: "Cannot manually change state" });
    }
  });

  const calculateScore = async (gameId) => {
    const gameRef = db.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) return;

    const game = gameDoc.data();
    if (!game.gameData || !Array.isArray(game.gameData.participants)) return;

    const participants = game.gameData.participants;
    const roundLiar = game.gameData.liar;
    const roundVotes = game.gameData.roundVotes || {};

    const voteCounts = {};
    Object.values(roundVotes).forEach((voteeId) => {
      voteCounts[voteeId] = (voteCounts[voteeId] || 0) + 1;
    });

    participants.forEach((player) => {
      const { id } = player;

      player.totalVotes += voteCounts[id] || 0;

      if (id === roundLiar) {
        if ((voteCounts[id] || 0) < Math.floor(participants.length / 2)) {
          player.roundScore = 10;
        } else {
          player.roundScore = 0;
        }
      } else {
        player.roundScore = roundVotes[id] === roundLiar ? 5 : 0;
      }

      player.totalScore += player.roundScore;

      player.roundVotes = 0;
      player.roundScore = 0;
      player.roundQuestion = "";
      player.roundAnswer = "";
    });

    await gameRef.update({
      "gameData.participants": participants,
      "gameData.roundLiar": "",
      "gameData.roundVotes": {},
    });
  };

  socket.on("disconnect", () => {
    for (let userId in userSocketMap) {
      if (userSocketMap[userId].socketId === socket.id) {
        userSocketMap[userId].isConnected = false;
        //console.log(`User with ID ${userId} disconnected.`);
        break;
      }
    }
    //console.log(`User disconnected: ${socket.id}`);
  });
});

async function assignLiarAndQuestions(gameId) {
  const gameRef = db.collection("games").doc(gameId);
  const game = (await gameRef.get()).data();
  if (!game || game.gameData.participants < 1) return;

  const participants = game.gameData.participants;

  const liarIndex = Math.floor(Math.random() * participants.length);
  const liarId = participants[liarIndex].id;
  const { liarQuestion, commonQuestion } = await generateQuestions();

  const updatedParticipants = participants.map((p) => ({
    ...p,
    roundQuestion: p.id === liarId ? liarQuestion : commonQuestion,
    roundAnswer: "",
  }));

  await gameRef.update({
    "gameData.participants": updatedParticipants,
    "gameData.liar": liarId,
    "gameData.roundQuestion": commonQuestion,
  });
}

async function generateQuestions() {
  return {
    liarQuestion: "What is your favorite movie?",
    commonQuestion: "What is your favorite book?",
  };
}

application.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});

application.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

// Export Express app and HTTP server
export { application, appServer };
