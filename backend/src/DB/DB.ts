import fs from "fs";
import { createConnection } from "typeorm";
import parse from "csv-parse";
import { Connection } from "typeorm/connection/Connection";
import StreamArray from "stream-json/streamers/StreamArray";
import * as path from "path";
import Port from "../entity/Port";
import AisData from "../entity/AisData";

export default class DB {
  static conn: Connection;

  static async init() {
    this.conn = await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "postgres",
      synchronize: true,
      logging: false,
      entities: ["dist/entity/*.js"]
    });
  }

  static async syncPorts() {
    console.log("Syncing ports");
    const parser = fs
      .createReadStream(path.join(__dirname, `../../mock/ports.csv`))
      .pipe(parse({ from: 2 }));

    // let i = 0;
    for await (const row of parser) {
      // if (i >= 1000) break;
      // i++;
      const port = new Port();
      port.country = row[1];
      port.location = row[2];
      port.name = row[3];
      port.nameWoDiacritics = row[4];
      port.subdivison = row[5];
      port.status = row[6];
      port.function = row[7];
      port.date = Number(row[8]);
      port.iata = row[9];
      port.coordinates = row[10];
      port.remarks = row[11];
      await port.save();
    }
    console.log("Ports saved");
  }

  static async syncAIS(filePath: string) {
    let raw = fs.readFileSync(filePath);
    // @ts-ignore
    let parsedAis = JSON.parse(raw);
    const count = parsedAis[0].RECORDS;
    const data = parsedAis[1] /*.slice(0, 100000)*/;
    console.log(`Synchronizing ${count} ais objects`);
    for (const datum of data) {
      const aisData = new AisData();
      aisData.mmsi = datum.MMSI;
      aisData.time = datum.TIME;
      aisData.longitude = datum.LONGITUDE;
      aisData.latitude = datum.LATITUDE;
      aisData.cog = datum.COG;
      aisData.sog = datum.SOG;
      aisData.heading = datum.HEADING;
      aisData.rot = datum.ROT;
      aisData.navstat = datum.NAVSTAT;
      aisData.imo = datum.IMO;
      aisData.name = datum.NAME;
      aisData.callSign = datum.CALLSIGN;
      aisData.type = datum.TYPE;
      aisData.a = datum.A;
      aisData.b = datum.B;
      aisData.c = datum.C;
      aisData.d = datum.D;
      aisData.draught = datum.DRAUGHT;
      aisData.dest = datum.DEST;
      aisData.eta = datum.ETA;
      await aisData.save();
    }
    console.log("Synchronized");
    // const jsonStream = StreamArray.withParser();
    //
    // //You'll get json objects here
    // //Key is an array-index here
    // jsonStream.on("data", ({ key, value }) => {
    //   console.log(key, value);
    // });
    //
    // jsonStream.on("end", () => {
    //   console.log("All done");
    // });
    //
    // const filename = path.join(__dirname, "../../mock/ais.json");
    // // @ts-ignore
    // fs.createReadStream(filename).pipe(jsonStream.input);
  }
}
