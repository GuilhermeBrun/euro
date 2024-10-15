import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitAllServices();
});

describe("GET api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parseUpdatedAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toEqual(parseUpdatedAt);

      expect(responseBody.dependencies.database.version).toEqual("17.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.open_connections).toEqual(1);
    });
  });
});
