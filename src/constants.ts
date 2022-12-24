import * as process from 'process';

export const basicConsants = {
  username: process.env.SA_LOGIN || 'admin',
  password: process.env.SA_PASSWORD || '123',
};
