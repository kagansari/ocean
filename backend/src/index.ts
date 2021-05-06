import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import multer from "multer";
import "reflect-metadata";
import DB from "./DB/DB";
import AisData from "./entity/AisData";
import Port from "./entity/Port";
import { Like } from "typeorm";
import { slugify } from "./utils";
import path from "path";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

const PORT = 3000;

export const CORS = {
  origin: [
    "http://127.0.0.1",
    "http://localhost",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://localhost:19000",
    "http://localhost:19001",
    "http://localhost:19002",
    "http://localhost:19003",
    "http://localhost:19004",
    "http://localhost:19005",
    "http://localhost:19006",
    "http://localhost:19007",
    "https://prowmes.netlify.com",
    "https://prowmes.netlify.app",
    "https://app.prowmes.com",
    "https://prowmesdev.netlify.com",
    "https://prowmesdev.netlify.app",
    "https://prowmes.app",
    "https://www.prowmes.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Content-Length",
    "operator_id",
    "manager_id",
    "technician_id",
    "language",
    "file-extension",
    "x-requested-with",
    "x-auth-type",
    "upper-configs",
    "cookie"
  ]
};

const app = express();

const run = async () => {
  await DB.init();

  app.use(cors(CORS));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get("/VesselAvailabilitySearch", async (req, res) => {
    // @ts-ignore
    const data = await AisData.search(req.query);
    res.json(data);
  });

  app.post("/ProcessAIS", upload.single("file"), async (req, res,next) => {
    try {
      let raw = fs.readFileSync(req.file.path);
      // @ts-ignore
      JSON.parse(raw);
      res.sendStatus(200);
    } catch (err) {
      return next(err)
    }

    await DB.syncAIS(req.file.path);
  });

  app.get("/ports", async (req, res) => {
    const where = {
      function: Like("1%"),
      slug: Like(`%${slugify(String(req.query.search))}%`)
    };
    const ports = await Port.find({
      where,
      take: 100
    });
    const count = await Port.count({ where });
    res.json({ count, items: ports });
  });

  app.post("/sync", async function(req, res) {
    await DB.conn.dropDatabase();
    await DB.conn.synchronize();
    await DB.syncPorts();
    await DB.syncAIS(path.join(__dirname, "../../mock/ais.json"));
  });
  app.post("/syncPorts", async function(req, res) {
    await DB.syncPorts();
  });
  app.post("/syncAIS", async function(req, res) {
    await DB.syncAIS(path.join(__dirname, "../../mock/ais.json"));
  });

  // @ts-ignore
  app.use(function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500);
    res.render("error", { error: err });
  });

  const server = http.createServer(app);

  server.listen(PORT);
  server.on("listening", () => {
    console.log(`Listening on port ${PORT}`);
  });
};

// noinspection JSIgnoredPromiseFromCall
run();
