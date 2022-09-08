require("dotenv").config();
const neo4j = require("neo4j-driver");
const {
  createRegions,
  createPrefectures,
  createCities,
  createAirports,
  createVillages,
  createTowns,
} = require("../backend/functions/geography");

const logger = require("../backend/helpers/logger");

async function main() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4j_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const ctx = {
    session,
  };

  try {
    await createRegions(ctx);
    await createPrefectures(ctx);
    await createCities(ctx);
    await createAirports(ctx);
    await createVillages(ctx);
    await createTowns(ctx);
  } catch (err) {
    console.error(err);
  } finally {
    session.close();
    logger.info("Session is closed");
    process.exit(0);
  }
}

main();
