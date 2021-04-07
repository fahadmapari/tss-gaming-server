import mongoose from "mongoose";

const gameScehma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
});

const Game = mongoose.model("Game", gameScehma);
export default Game;
