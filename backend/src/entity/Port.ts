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
import {slugify} from "../utils";

const getLatLngFromStr = (coordinateStr: string) => {
  const latitudeNumber = Number(coordinateStr.slice(0, 4)) / 100;
  const latitudeCoefficient = coordinateStr.slice(4, 5) === "N" ? 1 : -1;
  const longitudeNumber = Number(coordinateStr.slice(6, 11)) / 100;
  const longitudeCoefficient = coordinateStr.slice(11, 12) === "E" ? 1 : -1;

  return {
    latitude: latitudeNumber * latitudeCoefficient,
    longitude: longitudeNumber * longitudeCoefficient
  };
};

@Entity()
export default class Port extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  location: string;

  @Column()
  name: string;

  @Column()
  nameWoDiacritics: string;

  @Column({ nullable: true })
  subdivison: string;

  @Column()
  status: string;

  @Column()
  function: string;

  @Column("int")
  date: number;

  @Column({ nullable: true })
  iata: string;

  @Column({ nullable: true })
  coordinates: string;

  @Column({ nullable: true })
  remarks: string;

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

  @Column("double precision", { nullable: true })
  longitude: number;
  @Column("double precision", { nullable: true })
  latitude: number;
  @BeforeInsert()
  @BeforeUpdate()
  async setLatLng() {
    if (!this.coordinates) return;

    const latLng = getLatLngFromStr(this.coordinates);
    this.latitude = latLng.latitude;
    this.longitude = latLng.longitude;
  }

  @Column({ nullable: true })
  slug: string;
  @BeforeInsert()
  @BeforeUpdate()
  async setSlug() {
    this.slug = slugify(`${this.country}-${this.location}-${this.nameWoDiacritics}`);
  }
}
