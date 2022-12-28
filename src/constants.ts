import * as process from 'process';

export const basicConsants = {
  username: process.env.SA_LOGIN || 'admin',
  password: process.env.SA_PASSWORD || '123',
};
export const JWT_SECRET = process.env.JWT_SECRET || '123';
export const EMAILPASS = process.env.EMAILPASS || 'boupxfpwokxnpewp';
