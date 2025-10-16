import "dotenv/config";
import express, { type Application } from "express";
import prisma from "libs/prisma";

const app: Application = express();

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}`),
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
