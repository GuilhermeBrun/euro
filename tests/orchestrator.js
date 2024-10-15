import retry from "async-retry";

async function waitAllServices() {
  await waitWebServer();

  async function waitWebServer() {
    return await retry(
      async (bail, tries) => {
        if (tries >= 25) {
          console.log(`> Trying to connect to Webserver #${tries}. Are you running the server with "npm run dev"?`);
        }
        await fetch("http://localhost:3000/api/v1/status");
      },
      {
        retries: 100,
        minTimeout: 10,
        maxTimeout: 1000,
      },
    );
  }
}

export default { waitAllServices };
