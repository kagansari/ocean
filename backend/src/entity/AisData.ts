import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @Index()
  @Column("double precision")
  longitude: number;

  @Index()
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

  @ManyToOne(() => Port, { onDelete: "NO ACTION" })
  @JoinColumn({ name: "port_id" })
  port_id: number;
  @Column("int", { nullable: true })
  port?: Port;

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

  @Index()
  @Column({ nullable: true })
  destSlug: string;
  @BeforeInsert()
  @BeforeUpdate()
  async setSlug() {
    if (!this.dest) return;
    this.destSlug = slugify(this.dest);
  }

  @Index()
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

  private static getDestWhere(ports: Port[], idle: boolean = false) {
    const wheres = ports.map(port => {
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
    });

    return `(${wheres.join(" OR ")})`;
  }

  private static getEtaWhere(start: number, end: number, idle: boolean) {
    const startWhere = `"etaDate" >= '${moment(start).format()}'`;
    const endWhere = `"etaDate" <= '${moment(end).format()}'`;
    if (idle) {
      return `((${startWhere} AND ${endWhere}) OR "etaDate" IS NULL)`;
    }
    return `${startWhere} AND ${endWhere}`;
  }

  static async search(
    port: Port[],
    center: {
      latitude: number;
      longitude: number;
    },
    params: {
      type?: string;
      distance?: number;
      start?: string;
      end?: string;
      idle?: string;
    }
  ): Promise<AisData[]> {
    const distance = `(point(vessel.longitude, vessel.latitude)<@>point(${center.longitude}, ${center.latitude})) * 1.609344`;
    // const distanceToPort = `(point(longitude, latitude)<@>point(${port.longitude}, ${port.latitude})) * 1.609344`;
    let q = this.createQueryBuilder("vessel")
      .select(distance, "distance")
      .leftJoinAndSelect("vessel.port_id", "port")
      // .addSelect(distanceToPort, "distanceToPort")
      .addSelect("vessel.id","id")
      .addSelect("mmsi")
      .addSelect("time")
      .addSelect("vessel.longitude", "longitude")
      .addSelect("vessel.latitude", "latitude")
      .addSelect("cog")
      .addSelect("sog")
      .addSelect("vessel.name","name")
      .addSelect("draught")
      .addSelect("dest")
      .addSelect("eta")
      .addSelect(`"etaDate"`)
      .addSelect("imo")
      .addSelect("type")
      .addSelect("vessel.location","location");

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
    return q.getRawMany();
  }

  static async syncPortIds(port: Port) {
    const where = this.getDestWhere([port]);
    await this.query(
      `UPDATE ais_data SET port_id=${port.id} WHERE ${where} AND port_id IS NULL`
    );
  }
}
