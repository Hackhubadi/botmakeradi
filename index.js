import express from "express";
import TelegramBot from "node-telegram-bot-api";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.WEBHOOK_URL; // render url

const bot = new TelegramBot(TOKEN);

// 🔐 Webhook setup
bot.setWebHook(`${URL}/bot${TOKEN}`);

// Telegram webhook endpoint
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🔥 Expert bot running on webhook server\nNo polling. No downtime."
  );
});

// Example: security-style echo
bot.on("message", (msg) => {
  if (!msg.text) return;
  if (msg.text.startsWith("/")) return;

  bot.sendMessage(msg.chat.id, `📡 Received: ${msg.text}`);
});

app.get("/", (req, res) => {
  res.send("Bot alive 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
