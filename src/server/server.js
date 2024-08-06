import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import routerLogin from "../routes/login.js";
import routerUsers from "../routes/user.js";
import routerPlatforms from "../routes/Platform.js";
import routerAreas from "../routes/areas.js";
import { sendErrorResponse } from "../utils/sendResponse.js";
import routerSede from "../routes/sede.js";
import routerPeriodicity from "../routes/periodicity.js";
import routerEntity from "../routes/entity.js";
import routerSchedule from "../routes/schedule.js";
import routerReport from "../routes/report.js";
import routerTotal from "../routes/total.js";

//Create app
const app = express();

//Enable ALL CORS Requests
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

//App modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Compress application responses
app.use(compression());

//Configure security headers
app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  // console.log("🏈 Solicitud recibida:", req.method, req.url);
  // console.log("🏈 Solicitud recibida:", req.body);
  // console.log('🏈 Solicitud recibida:', req.body, req.headers);
  // console.log('🏈 Solicitud recibida:', req.headers);
  next();
});

//Handle body parser errors
app.use((err, req, res, next) => {

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
app.use("/users", routerUsers);
app.use("/areas", routerAreas);
app.use("/sedes", routerSede);
app.use("/platforms", routerPlatforms);
app.use("/entities", routerEntity);
app.use("/periodicity", routerPeriodicity);
app.use("/schedules", routerSchedule);
app.use("/totals", routerTotal);
app.use("/reports", routerReport);

export default app;
