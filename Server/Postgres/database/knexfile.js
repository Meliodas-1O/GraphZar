"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const config = {
    development: {
        client: "postgres",
        connection: {
            host: 'localhost',
            port: 5050,
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
