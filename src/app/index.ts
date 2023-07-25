// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express";
import sql from "../db/index.ts";

const app = express();

const reqLogger = function (req: Request, _res: Response, next: NextFunction) {
  console.info(`${req.method} request to => "${req.url}" by ${req.hostname}`);
  next();
};

app.use(reqLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  // Change the new URL() to just __dirname if using Node.
  res.status(200).sendFile(
    new URL(".", import.meta.url).pathname + "/html/index.html",
  );
});

// Display the form
app.get("/secret", (_req, res) => {
  res.status(200).sendFile(
    new URL(".", import.meta.url).pathname + "/html/form.html",
  );
});

// Process the form (ZERO VALIDATION IS DONE HERE!!!)
app.post("/secret", async (req, res) => {
  const { discord_name, name, address, city, state, zip, size } = req.body;
  try {
    await sql`
      INSERT INTO "Finishers" 
      ( discord_name, name, address, city, state, zip, size )
      values
      (${discord_name}, ${name}, ${address}, ${city}, ${state}, ${zip}, ${size})
    `;
    res.status(200).sendFile(
      new URL(".", import.meta.url).pathname + "/html/thanks.html",
    );
  } catch (error) {
    console.error(error);
    res.sendStatus(500).sendFile(
      new URL(".", import.meta.url).pathname + "/html/error.html",
    );
  }
});

export default app;
