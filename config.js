import "dotenv/config";

export const config = {
  PRODUCTION_DB: process.env.PRODUCTION_DB || "",
  DEVELOPMENT_DB: process.env.DEVELOPMENT_DB || "",
  DB_HOST: process.env.DB_HOST || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",
  ENVIRONMENT: process.env.NODE_ENV || "",
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || "",
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || "",
  APP_PORT: process.env.APP_PORT || "",
  APP_PORT_DB: process.env.APP_PORT_DB || ""
};
