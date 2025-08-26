import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 9091,
  nodeEnv: process.env.NODE_ENV ?? 'production',
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 8080),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'pipicucu',
  },
};

export default config;
