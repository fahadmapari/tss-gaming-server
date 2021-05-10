import { Agenda } from "agenda/es";

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI },
});
