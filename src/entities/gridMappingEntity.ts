import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "grid_mapping" })
export class GridMappingEntity {
  
  @PrimaryColumn()
  id!: number;

  @Column()
  grid_id!: string;

  @Column()
  plant!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  latitude!: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitude!: number;

}