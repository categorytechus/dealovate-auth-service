import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const { db_host, db_port, db_name, db_user, db_password, node_env } =
  process.env;

//console.log(path.join(__dirname, '../../entities/master') + `/*.{ts,js}`);

const config = {
  type: 'postgres',
  host: db_host,
  port: parseInt(db_port || '5432'),
  database: db_name,
  username: db_user,
  password: db_password,
  entities: [path.join(__dirname, '../../entities') + `/*.{ts,js}`],
  migrations: [path.join(__dirname + '../../../migrations') + `/*.{ts,js}`],
  logging: false, // new DatabaseLogger()
  synchronize: false, // don't use TRUE in production!
  migrationsRun: true,
} as DataSourceOptions;
const datasource = new DataSource(config);
datasource.initialize();
export default datasource;
