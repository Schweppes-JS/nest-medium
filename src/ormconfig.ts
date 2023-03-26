import { DataSource } from 'typeorm';

const config = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: 'asd761326',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
});

export default config;
