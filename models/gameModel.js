import mongoose from "mongoose";

const gameScehma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  cover: {
    type: String,
  },
});

const Game = mongoose.model("Game", gameScehma);
export default Game;
