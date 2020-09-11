import { ConnectionOptions } from 'typeorm';
import User from './users/user.entity';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
  migrations: ['build/database/migration/**/*.js'],
  subscribers: ['build/database/subscriber/**/*.js'],
};

export = config;
