const jpPrefecture = require("jp-prefecture");
const axios = require('axios')

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
  const url = 'https://www.wikitable2json.com/api/List_of_cities_in_Japan?table=1&keyRows=1'
  const { data } = await axios.get(url)
  const mapping = {
    "City (Special Ward)": 'en',
    "Japanese": 'name',
    "Prefecture": 'prefecture',
    "Population": 'population',
    "Area (km2)": 'area',
    "Density (per km2)": 'density',
    "Founded": 'founded',
  }

  const cities = data[0].map(city => {
    const object = {}
    Object.keys(mapping).forEach(key => {
      object[mapping[key]] = city[key]
    })
    object['id'] = `${object.en}_${object.prefecture}`
    return object
  })

  const result = await ctx.session.run(geography.createCities, { cities })

  logger.info('Cities created')

  return result
}

module.exports = {
  createRegions,
  createPrefectures,
  createCities
};
