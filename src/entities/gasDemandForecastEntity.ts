import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "gas_demand_forecast" })
@Index(['date', 'network'], { unique: true }) // Here
export class GasDemandForecastEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({type: 'date'})
  date!: string;

  @Column()
  network!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  gas_demand!: number;

  @Column()
  actual_forecast!: string;

  @Column()
  uploaded_at!: Date;
}