const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec database-dev pg_isready --host localhost", handleRun);

  function handleRun(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n\n🟢 Postgres is ready\n");
  }
}

process.stdout.write("\n\n🔴 Waiting for Postgres to be ready ");
checkPostgres();
