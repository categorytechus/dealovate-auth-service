import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const { db_host, db_port, db_name, db_user, db_password, node_env } =
  process.env;

let db: DataSource;

const getDb = async () => {
  let dbDS = new DataSource({
    type: 'postgres',
    host: db_host,
    port: parseInt(db_port || '5432'),
    username: db_user,
    password: db_password,
    database: db_name,
    synchronize: false,
    logging: false,
    entities: [path.join(__dirname, '../../entities') + `/*.entity.{ts,js}`],
    extra: {
      connectionLimit: 100, // Set the maximum number of connections in the pool
    },
  });
  db = await dbDS.initialize();
  return db;
};

export { getDb };
