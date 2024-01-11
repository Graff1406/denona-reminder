// telegramBot.ts

import { Message } from "node-telegram-bot-api";
import { bot } from "./config";
import { generateChatText } from "../gemini/geminiService";
import * as cron from "node-cron";
import * as moment from "moment-timezone";

const timeZone = moment.tz.guess();
const chatStates: Record<number, string[]> = {};

export const handleUserText = () => {
  bot.on("text", async (msg: Message) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
      const context = chatStates[chatId] || [];
      if (userMessage?.length) {
        const data = await generateChatText({
          context,
          prompt: `${userMessage}. Текущее дата и время: ${new Date()}`,
        });

        chatStates[chatId] = [...context, userMessage];
        const { text, pattern, textReminder } = JSON.parse(data) as {
          text: string;
          pattern: string;
          textReminder: string;
        };
        bot.sendMessage(chatId, `${text}. ${pattern}. ${textReminder}`);

        if (text && pattern)
          cron.schedule(
            pattern,
            () => {
              bot.sendMessage(chatId, textReminder);
            },
            { scheduled: true, timezone: timeZone }
          );
      }
    } catch (err) {
      console.error("Error handling user text:", err);
      bot.sendMessage(
        chatId,
        "Извините, произошла ошибка. Пожалуйста, повторите ваш запрос позже."
      );
    }
  });
};
