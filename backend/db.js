const Pool = require("pg").Pool;

const pool = new Pool({
    user: "root",
    password: "lo61SomUjtcU4vJfN8PC7ajglLKdhc1L",
    host: "dpg-cokslsud3nmc739kuc4g-a.oregon-postgres.render.com",
    port: 5432,
    database: "lunchflow",
    ssl: true
});
module.exports = pool;

