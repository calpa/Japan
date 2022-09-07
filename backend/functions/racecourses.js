const axios = require("axios");
const wdk = require("wikidata-sdk");
const logger = require("../helpers/logger");

const { listRaceCoursesInJapan } = require("../sparqls/racecourses");

const getRaceCoursesInJapan = async () => {
  const [url, body] = wdk.sparqlQuery(listRaceCoursesInJapan).split("?");

  const { data } = await axios.post(url, body);

  const result = data["results"]["bindings"];

  logger.info("Number of race courses: %d", result.length);

  return result;
};

module.exports = {
  getRaceCoursesInJapan,
};
