import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { BotClient } from "./src/bot/index.ts";
import { GatewayIntents } from "https://deno.land/x/harmony@v2.8.0/mod.ts";
import app from "./src/app/index.ts";

const bot = new BotClient();
const token = Deno.env.get("DISCORD_TOKEN");
const port = Deno.env.get("DISCORD_BOT_PORT");

if (token === null) {
  console.error("DISCORD_TOKEN must be set in the environment.");
  Deno.exit(1);
}

app.listen(port, () => {
  console.log(`App: Listening on ${port} ...`);
});

bot.connect(token, [
  GatewayIntents.GUILDS,
  GatewayIntents.DIRECT_MESSAGES,
]);
