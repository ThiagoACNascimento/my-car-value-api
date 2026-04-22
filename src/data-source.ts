import { DataSource } from 'typeorm';
import dbConfig from '../ormconfig.js';

export const AppDataSource = new DataSource(dbConfig as any);
