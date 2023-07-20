import sql from "../db/index.ts";
import {
  ApplicationCommandInteraction,
  ApplicationCommandOptionType,
  Client,
  event,
  slash,
} from "https://deno.land/x/harmony@v2.8.0/mod.ts";

// I highly recommend checking out the Harmony docs and exploring
// what else you can do here!

// A catalog of commands we're supporting, and arguments they need
const botCommands = [
  {
    name: "pledge",
    description: "Use this command to promise a new submission.",
    options: [
      {
        name: "summary",
        description: "Short Summary Description",
        required: true,
        type: ApplicationCommandOptionType.STRING,
      },
    ],
  },
  {
    name: "submit",
    description: "Submit Your Entry",
    options: [
      {
        name: "url",
        description: "A link (URL) to your submission.",
        required: true,
        type: ApplicationCommandOptionType.STRING,
      },
    ],
  },
  {
    name: "list",
    description: "Show your current pledge, if any.",
  },
  {
    name: "help",
    description: "Get the tl;dr on how I work",
  },
];

// Main bot "brain" that implements the above, by pairing them with methods
// that (optionally) run async.
export class BotClient extends Client {
  private formUrl: string | null;

  constructor() {
    super();
    this.formUrl = Deno.env.get("DISCORD_BOT_URL") || null;
    console.info(`Bot: Starting up ...`);
    if (this.formUrl) {
      console.info(
        `Bot: I will DM the form URL (${this.formUrl}) to pledge completers.`,
      );
    }
  }

  // This is run once auth completes successfully.
  @event()
  async ready(): Promise<void> {
    console.log(`Bot: Logged in as ${this.user?.tag}!`);
    // handle (re-) publishing our commands
    const commands = await this.interactions.commands.all();
    if (commands.size !== botCommands.length || Deno.env.get("DISCORD_BOT_REFRESH")) {
      console.info("App: Refreshing list of provided commands ...");
      this.interactions.commands.bulkEdit(botCommands);
    }
  }

  // Pledge to build [thing] which you describe in a one-sentence summary.
  // When done, you'll submit a link to it with another command.
  @slash()
  async pledge(d: ApplicationCommandInteraction): Promise<void> {
    const summary: string = d.option<string>("summary");
    const discord_name: string = d.user.username;
    const discord_id: string | number = d.user.id;
    const pledge = await sql`
    select
      discord_id, 
      summary
    from 
      "Promises" 
    where 
      discord_id = ${discord_id}
    `;
    if (pledge.length) {
      await sql`
      update "Promises"
      set
        summary = ${summary}
      where 
        discord_id = ${discord_id}
      `;
      d.reply(`I've updated your pledge to be: ${summary}`);
    } else {
      await sql`
      insert into "Promises" 
      ( discord_id, discord_name, summary )
      values
      ( ${discord_id}, ${discord_name}, ${summary} )
      `;
      d.reply(`I've created a new pledge for you: ${summary}`);
    }
  }

  // Users build something then "hand it in" by providing a link to it.
  // Then we DM them a link to fill out the prize form, if the URL is
  // set in the environment. Otherwise we just say congrats and store the
  // link.
  @slash()
  async submit(d: ApplicationCommandInteraction): Promise<void> {
    const url = d.option<string>("url");
    const discord_name: string = d.user.username;
    const discord_id: string | number = d.user.id;
    const pledge = await sql`
    update "Promises"
    set 
      url = ${url},
      completed = ${Date.now()}
    where
      discord_id = ${discord_id}
    returning summary
    `;
    if (pledge.length) {
      if (this.formUrl) {
        const channel = await d.user.createDM();
        channel.send(
          `Please enter your shipping and size details for your prize here: ${this.formUrl} `,
        );
      }
      d.reply(
        `Congrats! ${discord_name} has completed their challenge for: ${
          pledge[0].summary
        }! (I just DM'd you)`,
      );
    } else {
      d.reply(`Sorry, I couldn't find a pledge that's linked to you. Why not try creating one?`);
    }
  }

  // Allow users to query what project is tracked for them.
  @slash()
  async list(d: ApplicationCommandInteraction): Promise<void> {
    const discord_name: string = d.user.username;
    const discord_id: string | number = d.user.id;
    const pledge = await sql`
    select
      summary
    from
      "Promises"
    where
      discord_id = ${discord_id}
    `;
    if (pledge.length) {
      d.reply(`You're currently working on: "${pledge[0].summary}"`);
    } else {
      d.reply(
        `I'm not tracking any projects for ${discord_name}; why not pledge one?`,
      );
    }
  }

  // note this one isn't async!
  @slash()
  help(d: ApplicationCommandInteraction): void {
    d.reply(
      `Use this tool to promise to build something, then submit a link to get a prize!`,
    );
  }
}
