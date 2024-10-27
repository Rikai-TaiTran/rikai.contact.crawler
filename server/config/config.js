module.exports = {
    development: {
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rikai_lead',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres'
    },
    test: {
      username: process.env.DB_USERNAME || 'your_db_username',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'your_db_name',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres'
    },
    production: {
      username: process.env.DB_USERNAME || 'your_db_username',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'your_db_name',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres'
    }
  };
  