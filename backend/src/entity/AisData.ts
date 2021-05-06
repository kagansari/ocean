import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import Port from "./Port";
import { slugify } from "../utils";
import moment from "moment";

@Entity()
export default class AisData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { unique: true })
  mmsi: number;

  @Column("timestamp with time zone")
  time: Date;

  @Column("double precision")
  longitude: number;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  cog: number;

  @Column("double precision")
  sog: number;

  @Column("int")
  heading: number;

  @Column("int")
  rot: number;

  @Column("int")
  navstat: number;

  @Column("int")
  imo: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  callSign: string;

  @Column("int")
  type: number;

  @Column("int")
  a: number;

  @Column("int")
  b: number;

  @Column("int")
  c: number;

  @Column("int")
  d: number;

  @Column("double precision")
  draught: number;

  @Column({ nullable: true })
  dest: string;

  @Column({ nullable: true })
  eta: string;

  @Column("point", { nullable: true })
  location: string;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()"
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "NOW()"
  })
  public updated_at: Date;

  @Column({ nullable: true })
  destSlug: string;
  @BeforeInsert()
  @BeforeUpdate()
  async setSlug() {
    if (!this.dest) return;
    this.destSlug = slugify(this.dest);
  }

  @Column("timestamp", { nullable: true })
  etaDate: Date;
  @BeforeInsert()
  @BeforeUpdate()
  async setEta() {
    if (this.eta && moment(this.eta).isValid()) {
      this.etaDate = moment(this.eta)
        .year(moment().year())
        .toDate();
    }
  }

  private static getDestWhere(port: Port, idle: boolean) {
    const portNameSlug = slugify(port.nameWoDiacritics);
    const countrySlug = slugify(port.country);
    const locationSlug = slugify(port.location);

    let where = `"destSlug" LIKE '${portNameSlug}%'`;
    where += ` OR "destSlug" LIKE '${countrySlug}-${locationSlug}%'`;
    where += ` OR "destSlug" LIKE '${countrySlug}${locationSlug}%'`;
    if (idle) {
      where += ` OR "destSlug" IS NULL`;
    }
    return `(${where})`;
  }

  private static getEtaWhere(start: number, end: number, idle: boolean) {
    const startWhere = `"etaDate" >= '${moment(start).format()}'`;
    const endWhere = `"etaDate" <= '${moment(end).format()}'`;
    if (idle) {
      return `((${startWhere} AND ${endWhere}) OR "etaDate" IS NULL)`;
    }
    return `${startWhere} AND ${endWhere}`;
  }

  static async search(params: {
    portId: number;
    type: string;
    distance: number;
    start: string;
    end: string;
    idle: string;
  }): Promise<AisData[]> {
    const port = await Port.findOneOrFail(params.portId);
    const distance = `(point(longitude, latitude)<@>point(${port.longitude}, ${port.latitude})) * 1.609344`;
    let q = this.createQueryBuilder("vessel")
      .select(distance, "distance")
      .addSelect("id")
      .addSelect("mmsi")
      .addSelect("time")
      .addSelect("longitude")
      .addSelect("latitude")
      .addSelect("cog")
      .addSelect("sog")
      .addSelect("name")
      .addSelect("draught")
      .addSelect("dest")
      .addSelect("eta")
      .addSelect(`"etaDate"`)
      .addSelect("imo")
      .addSelect("type")
      .addSelect("location");

    q.where(this.getDestWhere(port, Boolean(Number(params.idle))));
    q.andWhere(
      this.getEtaWhere(
        Number(params.start),
        Number(params.end),
        Boolean(Number(params.idle))
      )
    );
    q.andWhere(`${distance} <= ${params.distance}`);

    if (params.type === "tanker") {
      q.andWhere(`type >= 80 AND type <= 89`);
    }

    q.orderBy("distance", "ASC");
    console.log(q.getSql());
    return q.getRawMany();
  }
}
