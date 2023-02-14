import knex from 'knex'

const knexfile = require('./knexfile')

export const database = knex(knexfile.development)

module.exports = database