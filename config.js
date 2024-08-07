import "dotenv/config";

export const config = {
  PRODUCTION_DB: process.env.PRODUCTION_DB || "sistema_integral",
  DEVELOPMENT_DB: process.env.DEVELOPMENT_DB || "sistema_integral",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "juanCamilo",
  DB_PASSWORD: process.env.DB_PASSWORD || "est@ndar2022**",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  ENVIRONMENT: process.env.ENVIRONMENT || "production",
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || "",
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || "",
  APP_PORT: process.env.APP_PORT || "",
  APP_PORT_DB: process.env.APP_PORT_DB || "3307"
};
