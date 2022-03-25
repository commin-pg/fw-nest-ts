import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig ={
  type: 'postgres',
  port: 5432,
  database: 'exam_db',
  host: '127.0.0.1',
  username: 'postgres',
  password: 'postgres',
  synchronize: true
}
export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  logging:true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: "migrations_history",
  migrationsRun: true,
  
};
