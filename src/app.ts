import "dotenv/config";
import express, { type Application } from "express";
import prisma from "./libs/prisma";
import cors from "cors";

const app: Application = express();

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

// ------------------
// GLOBAL MIDDLEWARES
// ------------------
app.use(cors());
app.use(express.json());

// ---------------
// REGISTER ROUTES
// ---------------
import authRouter from "./handlers/auth-handler";
import bookRouter from "./handlers/book-handler";
import genreRouter from "./handlers/genre-handler";
import transactionRouter from "./handlers/transaction-handler";

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Hello World!",
    data: new Date().toDateString(),
  });
});
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/genre", genreRouter);
app.use("/transactions", transactionRouter);

// ---------------------------------
// APP LISTENING AND SIGNAL HANDLING
// ---------------------------------
app.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}`));

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
