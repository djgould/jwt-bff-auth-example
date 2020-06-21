import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: '', unique: true})
    username: string;

    @Column({default: ''})
    passwordHash: string;

    @Column({default: ''})
    refreshToken: string;
}