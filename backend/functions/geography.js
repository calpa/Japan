const jpPrefecture = require("jp-prefecture");
const axios = require("axios");
const cheerio = require("cheerio");

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

const createCities = async (ctx) => {
  const url = `https://en.wikipedia.org/wiki/List_of_cities_in_Japan`
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const table = $("#mw-content-text > div.mw-parser-output > table:nth-child(9) tr")
    .map((index, element) => ({
      en: $(element).find('td:nth-child(1) a').text().trim(),
      name: $(element).find('td:nth-child(2)').text().trim(),
      prefecture: $(element).find('td:nth-child(3) a').text().trim(),
      population: $(element).find('td:nth-child(4)').text().trim(),
      area: $(element).find('td:nth-child(5)').text().trim(),
      density: $(element).find('td:nth-child(6)').text().trim(),
      founded: $(element).find('td:nth-child(7)').text().trim(),
    }))
    .get()

  logger.info(`Expected number of cities to be ${table.length}`)

  const cities = table.map((city) => {
    const object = city;
    // Object.keys(mapping).forEach((key) => {
    //   object[mapping[key]] = city[key];
    // });
    object["id"] = `${object.en}_${object.prefecture}`;
    // if (object.prefecture) {
    //   Object.entries(prefectures).forEach(([key, value]) => {
    //     if (object.prefecture === key) {
    //       object.prefecture = value;
    //     }
    //   });
    // } else {
    //   logger.info(`${city.name} has no prefecture`);
    // }

    return object;
  });

  const result = await ctx.session.run(geography.createCities, { cities });

  logger.info("Cities created");

  return result;
};

const createAirports = async (ctx) => {
  const url = `https://www.wikitable2json.com/api/List_of_airports_in_Japan?table=0&keyRows=1`
  const { data } = await axios.get(url)

  const airports = data[0].map((airport) => {
    const object = airport;
    object.cities = object.Municipality.split(' / ')
    object.name = object['Airport name']
    object.classification = object['Classification']
    return object;
  })

  const result = await ctx.session.run(geography.createAirports, { airports })

  logger.info(`Airports created`)
  return data
}

module.exports = {
  createRegions,
  createPrefectures,
  createCities,
  createAirports
};
