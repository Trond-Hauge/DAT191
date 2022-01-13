"use strict";

import knex from "knex";

/*
const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'dat191',
    port: '5433',
    maxConnect: '3'    
});
*/

export const db = knex({
  client: "pg",
  connection: {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    database: "dat191",
    port: "5433",
  },
  debug: false,
  pool: {min: 1, max: 5},
});
