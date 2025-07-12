import { DataSource } from 'typeorm';
import config from './config';
import * as models from '../api/models/entity';
import { SeedRunner } from './seeds/seedRunner';

export const AppDataSource = new DataSource({
  type: `postgres`,
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  entities: models,
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

export async function initializeDataSource() {
  console.info('Inicializando la fuente de datos con typeORM...');
  await AppDataSource.initialize()
    .then(() => {
      console.info(
        'Se ha establecido la conexión con la base de datos con typeORM',
      );
    })
    .catch((err) => {
      console.error(
        'Ha habido un error con la conexion a la base de datos con typeORM',
        err,
      );
    });
  const seedRunner = new SeedRunner(AppDataSource);
  seedRunner.run();
}
