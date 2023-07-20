# Neon Discord Prize Bot - Companion Repository

![Discord Prize Bot](assets/prizebot.png)

This is the companion repository for the [Neon's Branching Tutorial](#), which you should
definitely read before diving in here.

## What's Here?

This app is a Discord bot written using [Harmony](https://deno.land/x/harmony@v2.8.0) designed
to run on [Deno](https://deno.land), because the out-of-the-box TypeScript experience is great.
A docker image based on Deno's is provided in case you don't want to install anything.

It also features a back-end micro web service that serves a form and handles submission,
where users enter their shipping information to receive their prizes, which is written
using [ExpressJS](https://expressjs.com/).

Finally, [Prisma](https://www.prisma.io/) is used to manage migrations, while we take advantage of a
lightweight drop-in replacement for Node's postgres module, [PostgresJS](https://deno.land/x/postgresjs@v3.3.5).

## What's Needed To Run It?

You'll need to [sign up for Neon](https://neon.tech), of course. You'll need a Discord application key
[which you can obtain here](https://discord.com/developers) after you watch this [extremely helpful 2-minute
video on how to get the correct secret quickly](https://www.loom.com/share/b130a869382946f7a6049b446154408a).

You can also, optionally, just [watch a quick demo of the bot functioning](https://www.loom.com/share/cd8c138d1d20485c9ff0bae987abf871?sid=7f65dd42-41fc-4427-9b4c-72cc2c832f6b) if you're simply curious.

If you have Deno installed, navigate to the repository root and just run:

```sh
> deno task dev
```

This will grab whatever dependencies are needed, and start the services with a watcher so it restarts if you
change the code. If you don't have Deno available you can run the less-interactive Docker image like so:

```sh
> sudo docker compose up --build
```

While the demo is fairly feature-complete, insert your favorite disclaimer about polishing some things up a
bit before unleashing it on the world for real - all code is for demonstration purposes only.

## Caveats

When running migrations, use `npx prisma migrate dev` if you get an error from Deno that it can't find a URL
to import. There seems to be a temporary glitch at the time this was published, so noting it just in case.
