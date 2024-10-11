import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const versionPostgresDb = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(databaseMaxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const dataBaseOpenConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dataBaseOpenConnectionsValue = dataBaseOpenConnectionsResult.rows[0].count;

  res.status(200).json({
    update_at: updatedAt,
    dependencies: {
      database: {
        version: versionPostgresDb,
        max_connections: maxConnections,
        open_connections: dataBaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
