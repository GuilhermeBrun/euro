import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {
  let dbclient;
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    dbclient = await database.getNewClient();

    const migrationsOptions = {
      dbClient: dbclient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...migrationsOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        res.status(201).json(migratedMigrations);
        return;
      }

      res.status(200).json(migratedMigrations);
    }

    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(migrationsOptions);
      res.status(200).json(pendingMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbclient.end();
  }
}
