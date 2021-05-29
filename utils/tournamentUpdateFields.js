export const tournamentUpdateFields = (data, tournament) => {
  const {
    title,
    description,
    entryFee,
    date,
    game,
    tournamentType,
    kills,
    streak,
    damage,
    prize,
    roomId,
    roomPassword,
    stream,
    slots,
  } = data;

  const fieldsToUpdate = {};

  if (title) fieldsToUpdate.title = title;
  if (description) fieldsToUpdate.description = description;
  if (entryFee) fieldsToUpdate.entryFee = entryFee;
  if (date) fieldsToUpdate.date = new Date(date);
  if (game) fieldsToUpdate.game = game;
  if (tournamentType) fieldsToUpdate.tournamentType = tournamentType;
  if (kills) fieldsToUpdate.prizeDistribution.kills = kills;
  if (streak) fieldsToUpdate.prizeDistribution.streak = streak;
  if (damage) fieldsToUpdate.prizeDistribution.damage = damage;
  if (prize) fieldsToUpdate.prize = prize;
  if (roomId) {
    fieldsToUpdate.credentials = {};
    fieldsToUpdate.credentials.roomId = roomId;
  }
  if (roomPassword) {
    fieldsToUpdate.credentials = {};
    fieldsToUpdate.credentials.roomPassword = roomPassword;
  }
  if (slots) fieldsToUpdate.slots = slots;
  if (slots) {
    const newAvailableSlots =
      slots - (tournament.slots - tournament.slotsAvailable);
    fieldsToUpdate.slotsAvailable = newAvailableSlots;
  }
  if (stream) fieldsToUpdate.stream = stream;

  return fieldsToUpdate;
};
