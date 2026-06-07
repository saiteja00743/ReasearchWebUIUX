import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

await connectDatabase();

createApp().listen(port, () => {
  console.log(`ResearchHub API running on http://localhost:${port}/api/v1`);
});
