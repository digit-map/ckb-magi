import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('block')
export class BlockEntity {
  @PrimaryColumn()
  hash: string;

  @Column()
  number: number;

  @Column()
  difficulty: string;

  @Column()
  timestamp: string;

  @Column()
  parentHash: string;
}
