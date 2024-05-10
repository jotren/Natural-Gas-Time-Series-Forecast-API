import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "grid_list" })
export class GridListEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  grid_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  latitude!: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitude!: number;

}