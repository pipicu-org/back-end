import { DataSource } from 'typeorm';
import * as models from '../api/models/entity';
import { SeedRunner } from './seeds/seedRunner';
import config from './config';

export const AppDataSource = new DataSource({
  type: `postgres`,
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  entities: models,
  migrations:
    config.nodeEnv == 'development'
      ? ['src/migrations/*.ts']
      : ['build/migrations/*.js'],
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
      throw new Error(
        'Error al inicializar la fuente de datos con typeORM: ' +
          err +
          err.stack,
      );
    });

  console.info('Ejecutando migraciones...');
  await AppDataSource.runMigrations();
  console.info('Migraciones ejecutadas exitosamente.');

  const seedRunner = new SeedRunner(AppDataSource);
  await seedRunner.run();
}
