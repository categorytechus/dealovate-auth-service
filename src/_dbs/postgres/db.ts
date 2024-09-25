import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CustomNamingStrategy } from '../../_configs/customNamingStrategy';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

const { db_host, db_port, db_name, db_user, db_password, node_env } =
  process.env;

export const db = new DataSource({
  type: 'postgres',
  host: db_host,
  port: parseInt(db_port || '5432'),
  username: db_user,
  password: db_password,
  database: db_name,
  synchronize: node_env === 'dev' ? true : false,
  logging: false,
  entities: [path.join(__dirname, '../../entities') + `/*.entity.{ts,js}`],
  // namingStrategy: new CustomNamingStrategy(),
});
