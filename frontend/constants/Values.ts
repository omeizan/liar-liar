import * as Yup from "yup";
const VALUES = {
  Modals: {
    JOIN: "Join",
    CREATE: "New Game",
    HELP: "Help",
  },
  GameStates: {
    WAITING: "waiting",
    ANSWERING: "answering",
    VOTING: "voting",
    REVEALING: "revealing",
    ENDED: "ENDED",
  },
  Icons: {
    NEW: "plus",
    JOIN: "sign-in",
    HELP: "question",
    HOME: "home"
  },
  Tips:
  [
    "Click 'New Game' to create a game, select the number of rounds, voting time, and answer time. You'll get a game code to share with others OR click 'Join Game' to enter a code provided by the host.",
    "Once all participants (3-8 players) are in the lobby, the game host can start the round.",
    "In each round, you'll be given a question. You have to answer before the timer runs out and send your answer.",
    "A new timer starts! All players' answers and the 'true' question will be shown. The group will deliberate and vote on who they believe the liar (randomly chosen player that got a different question ) is.",
    "After the vote, the liar is revealed! If the liar doesn't get the majority vote, they score 10 points. If the liar is voted correctly, all other players get 5 points!"
  ],
  

  Messages: {
    DEFAULT_ERROR_MESSAGE: "Something went wrong",
    ENTERING_GAME: "Entering Game",
    CREATED_GAME: "Game Created",
    RETURN_HOME: "Returning Home",
    GAME_NOT_FOUND : "Game not found",
    NO_PERMISSION : "You don't have the permission to view this page"
  },
  Validator: (property_name: string, format: "alphanumeric" | "integer" | "string", required?: boolean) => {

    if ( format === "string"){
        let schema = Yup.string()
        if (required) {
            schema = schema.required(`${property_name} is required.`);
        }

        return schema;
    }

    let schema =
      format === "alphanumeric"
        ? Yup.string()
            .matches(
              /^[a-zA-Z0-9]+$/,
              `${property_name} must contain only alphabets and numbers, no special characters.`
            )
        : Yup.number()
            .integer(`${property_name} must be an integer.`)
            .typeError(`${property_name} must be a number.`);
  
    if (required) {
      schema = schema.required(`${property_name} is required.`);
    }
  
    return schema;
  },

  MIN_PLAYERS:3,
  MAX_PLAYERS:8,
  NumRounds: [5, 10, 15, 20],
  VotingTime: [60, 75, 90, 120],
  AnswerTime: [30, 45, 60, 75],
} as const;

export type ModalTypes =
  | (typeof VALUES.Modals)[keyof typeof VALUES.Modals]
  | null;

export default VALUES;
