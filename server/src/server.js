import app from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";

async function bootstrap() {
  await connectMongo();
  app.listen(env.PORT, () => console.log(`✅ Server running on :${env.PORT}`));
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});