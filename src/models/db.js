
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function initDB(url, options) {
  logger.info("DB. Satrt connection to db.");
  const defaults = { useNewUrlParser: true };
  mongoose.connect(url, { ...defaults, ...options });
  logger.info("Connected to db");
}