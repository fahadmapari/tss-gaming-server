import mongoose from "mongoose";

const leaderboardScehma = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardScehma);
export default Leaderboard;
