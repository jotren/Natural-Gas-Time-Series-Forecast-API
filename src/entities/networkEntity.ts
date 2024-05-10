import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "network" })
export class NetworkEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  network!: string;

  @Column()
  GDUK_mapping!: string;
}