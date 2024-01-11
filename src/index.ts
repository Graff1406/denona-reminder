// index.ts

import express from "express";
import { Request, Response } from "express";
import { bot } from "./telegram/config";
import { handleUserText } from "./telegram/messages";

const app = express();
const PORT = process.env.PORT || 4000;
const path = "denona-reminder-bot";
const isDev = process.env.NODE_ENV === "development";

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, I'm Denona Reminder Telegram Bot!");
});

app.post(`/${path}`, (req: Request, res: Response) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

handleUserText();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

bot
  .setWebHook(
    isDev
      ? `https://c300-200-55-245-140.ngrok-free.app/${path}`
      : `https://denona-reminder.onrender.com/${path}`
  )
  .catch((error: Error) => {
    console.error(error);
  });
