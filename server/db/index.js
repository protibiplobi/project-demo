const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");

async function executeQuery(query, binds = {}, options = {}) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, binds, { autoCommit: true, ...options });
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { executeQuery };
