import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import routerLogin from "../routes/login.js";
import routerAreas from "../routes/areas.js";
import { sendErrorResponse } from "../utils/sendResponse.js";

//Create app
const app = express();

//Enable ALL CORS Requests
app.use(cors());

//App modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Compress application responses
app.use(compression());

//Configure security headers
app.use(helmet());

app.use((req, res, next) => {
  console.log('🏈 Solicitud recibida:', req.method, req.url);
  console.log('🏈 Solicitud recibida:', req.body, req.headers);
  next();
});

//Handle body parser errors
app.use((err, req, res, next) => {
  console.log("❌ ~ app.use ~ err:", err);
  
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.setHeader("Content-Type", "application/json");
    return sendErrorResponse(res, 400, 201, "Request has invalid data");
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to the API"
  });
});


app.use("/login", routerLogin);
app.use("/areas", routerAreas);

export default app;
