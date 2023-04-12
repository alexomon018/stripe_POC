import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import * as env from "dotenv";
import router from "./router.js";
import { Server } from "socket.io";
import session from "express-session";
import { setStripeWebhook } from "./modules/webHooks.js";
const app = express();

const server = createServer(app);

const io = new Server(server);

setStripeWebhook(app, io);

env.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(process.env.STATIC_DIR));

app.use("/", router);

server.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
