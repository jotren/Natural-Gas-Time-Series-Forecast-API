import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "stormglass_data" })
@Index(['date', 'grid_id'], { unique: true }) // Here
export class WeatherDataEntity {

  @PrimaryGeneratedColumn()
  id!: string;

  @Column({type: 'date'})
  date!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grid_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  windSpeed_min!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  airTemperature_min!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  humidity_min!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  windSpeed_median!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  airTemperature_median!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  humidity_median!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  windSpeed_max!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  airTemperature_max!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  humidity_max!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precipitation!: number;

  @Column()
  uploaded_at!: Date
}