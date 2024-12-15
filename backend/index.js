import fs from "fs";
import path from "path";
import { TwitterApi } from "twitter-api-v2";
import anyText from "any-text";
import dotenv from "dotenv";
import config from "./config.json" assert { type: "json" };
import { fileURLToPath } from "url";
import { dirname } from "path";
import OpenAI from "openai";
dotenv.config();

const AIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const generateContentAI = async (prompt) => {
  const response = await AIClient.chat.completions.create({
    model: "grok-beta",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: config.writerGPTPrompt,
      },
    ],
  });

  return response.choices[0].message.content.trim();
};

// Salva il post nel blog Astro
const savePostToAstro = (title, content) => {
  const date = new Date().toISOString().split("T")[0];
  const filename = `${date}-${title.toLowerCase().replace(/ /g, "-")}.md`;
  const postContent = `---\ntitle: "${title}"\ndate: "${date}"\n---\n\n${content}`;

  const filePath = path.join(__dirname, `${config.finalPath}${filename}`);
  fs.writeFileSync(filePath, postContent);
  console.log(`Post salvato: ${filename}`);
};

// Pubblica su Twitter
const postToTwitter = async (content) => {
  setTimeout(async () => {
    try {
      const tweet = await twitterClient.v2.tweet(content);
      console.log("Tweet pubblicato:", tweet);
    } catch (error) {
      console.error("Errore nella pubblicazione su Twitter:", error);
    }
  }, +config.publishXAfter * 1000);
};

// Funzione principale
const generateAndPost = async () => {
  try {
    console.log("Inizio processo di generazione post...");

    const promptFilePath = `${process.cwd()}/prompt.pdf`;
    let prompt;
    try {
      prompt = await anyText.getText(promptFilePath);
    } catch (error) {
      console.error(
        "Errore durante la lettura del prompt, il file potrebbe non essere valido o non generato da Microsoft Word:",
        error
      );
      return;
    }

    // Genera contenuto con OpenAI
    const content = await generateContentAI(prompt);

    // Estrai il titolo dal contenuto (primi 50 caratteri come esempio)
    const title = content
      .split("\n")[0]
      .slice(0, 50)
      .replace(/[^a-zA-Z0-9 ]/g, "-");

    // Salva il post nel blog
    savePostToAstro(title, content);
    console.log("Post generato e pubblicato con successo!");

    // Pubblica su Twitter
    await postToTwitter(content);
  } catch (error) {
    console.error("Errore durante il processo:", error);
  }
};

const formatCronToHuman = (cronTime) => {
  cronTime = cronTime.replace(/\*/gi, "0");
  const cronParts = cronTime.split(" ");
  return `Ogni ${cronParts[1]} giorno/i, alle ore ${cronParts[2]}:${cronParts[3]}:${cronParts[4]}:${cronParts[5]}`;
};

console.log("Esecuzione pianificata per:", formatCronToHuman(config.cronTime));
new CronJob(config.cronTime, generateAndPost, null, true, "Europe/Rome");
