const jpPrefecture = require("jp-prefecture");
const geography = require("../cyphers/geography");
const logger = require("../helpers/logger");

const createRegions = async (ctx) => {
  const regions = jpPrefecture.getAll("region");
  const result = await ctx.session.run(geography.createRegions, { regions });

  logger.info("Regions created");
  return result;
};

const createPrefectures = async (ctx) => {
  const prefectures = jpPrefecture.getAll("pref");
  const result = await ctx.session.run(geography.createPrefectures, {
    prefectures,
  });

  logger.info("Prefectures created");
  return result;
};

module.exports = {
  createRegions,
  createPrefectures,
};
