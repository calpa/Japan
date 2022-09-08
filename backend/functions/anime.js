const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("../helpers/logger");

const yearMapping = {
  2021: `88Spot2021Edition`,
  2020: `88Spot2020Edition`,
  2019: `88Spot2019Edition-1`,
  2018: `88Spot2018Edition`,
};

// TODO: Parse 2022
const listAnimeTourism88 = async (year = 2021) => {
  const url = `https://animetourism88.com/ja/${yearMapping[year]}`;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const list1 = $("table")
    .first()
    .find("tr")
    .map(function (index, element) {
      const [anime, location] = $(this)
        .children()
        .map(function (index, element) {
          return $(this).text().trim();
        })
        .get();

      return {
        anime,
        location,
      };
    })
    .get();

  const list2 = $("table:nth-child(5)")
    .find("tr")
    .map(function (index, element) {
      const [event, location] = $(this)
        .children()
        .map(function (index, element) {
          return $(this).text().trim();
        })
        .get();

      return {
        event,
        location,
      };
    })
    .get();

  return [list1, list2];
};

module.exports = {
  listAnimeTourism88,
};
