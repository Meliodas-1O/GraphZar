import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {

    development: {
        client: "postgres",
        connection: {
          host : 'localhost',
          port : 5050,
          database: "database",
          user: "postgres",
          password: 'Meliodas10++'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

};

module.exports = config;
