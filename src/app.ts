import "dotenv/config";
import express, { type Application } from "express";
import prisma from "libs/prisma";

const app: Application = express();

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

// ---------------
// REGISTER ROUTES
// ---------------
import authRouter from "./handlers/auth-handler";
import bookRouter from "./handlers/book-handler";
import genreRouter from "./handlers/genre-handler";
import transactionRouter from "./handlers/transaction-handler";

app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/genre", genreRouter);
app.use("/transactions", transactionRouter);

// ---------------------------------
// APP LISTENING AND SIGNAL HANDLING
// ---------------------------------
app.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}`),
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
