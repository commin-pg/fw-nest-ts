import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';


const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: process.env.RDS_TYPE || dbConfig.type,
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
  migrationsRun:  process.env.SYNCHRONIZE || dbConfig.synchronize,
  timezone:'Asia/Seoul',
  namingStrategy: new SnakeNamingStrategy(), 
  
};
