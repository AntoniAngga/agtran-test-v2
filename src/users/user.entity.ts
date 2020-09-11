import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public password: string;

  @Column()
  public firstName: string;

  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public lastName?: string;

  @Column()
  public birthDate: Date;

  @Column({
    unique: true,
  })
  public icNumber: string;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;
}

export default User;
