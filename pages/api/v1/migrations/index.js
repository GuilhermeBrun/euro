import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {
  const dbclient = await database.getNewClient();

  const migrationsOptions = {
    dbClient: dbclient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsOptions,
      dryRun: false,
    });

    await dbclient.end();

    if (migratedMigrations.length > 0) {
      res.status(201).json(migratedMigrations);
      return;
    }

    res.status(200).json(migratedMigrations);
  }

  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);
    await dbclient.end();
    res.status(200).json(pendingMigrations);
  }

  res.status(405).end();
}
