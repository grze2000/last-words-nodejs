import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import mongoose from "mongoose";
import { swaggerDocs } from "./src/config/swagger";
import { configurePassport } from "./src/config/passport";
import { authController } from "./src/controllers/auth.controller";
import { messageController } from "./src/controllers/message.controller";

configurePassport();

const app: Express = express();

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log(`[${new Date().toLocaleString()}] Connected to database`);
  })
  .catch((err) => {
    console.log(
      `[${new Date().toLocaleString()}] Database connection error: ${err}`
    );
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

const v1Router = express.Router();
v1Router.use("/auth", authController);
v1Router.use("/messages", messageController);
v1Router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/v1", v1Router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString()}] Listening on ${PORT}`);
});
