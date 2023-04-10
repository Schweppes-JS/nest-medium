import { DataSource } from 'typeorm';
import { dataSourceOptions } from './ormconfig';

const dataSeedSourceOptions = {
  ...dataSourceOptions,
  migrations: [__dirname + '/seeds/**/*.{js,ts}'],
};

const appSeedDataSource = new DataSource(dataSeedSourceOptions);

appSeedDataSource.initialize();

export default appSeedDataSource;
