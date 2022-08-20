// Use Tag Function to highlight in VS Code
const cypher = (query) => query.raw[0];

const createRegions = cypher`
UNWIND $regions as region
MERGE (r:Region{id: region.id})
SET r.name = region.name
SET r.kana = region.kana
SET r.en = region.en
WITH r, region.neighbor as neighbor
UNWIND neighbor as id
MERGE (r2:Region{id: id})
MERGE (r)-[:NEIGHBOR]-(r2)
`;

const createPrefectures = cypher`
UNWIND $prefectures as prefecture
MERGE (p:Prefecture{id: prefecture.id})
SET p.name = prefecture.name
SET p.short = prefecture.short
SET p.kana = prefecture.kana
SET p.en = prefecture.en

WITH p, prefecture.region as region, prefecture.neighbor as neighbor
MATCH (r:Region{id: region})
MERGE (p)-[:REGION]->(r)

WITH p, neighbor
UNWIND neighbor as id
MERGE (p2:Prefecture{id: id})
MERGE (p)-[:NEIGHBOR]-(p2)
`;

const createCities = cypher`
UNWIND $cities as city
MERGE (c:City{id: city.id})
SET c.en = city.en,
    c.name = city.name,
    c.population = apoc.number.parseInt(city.population),
    c.area = apoc.number.parseFloat(city.area),
    c.density = apoc.number.parseFloat(city.density),
    c.founded = city.founded
WITH c, city
MATCH (p:Prefecture{en: toLower(city.prefecture)})
MERGE (c)-[:IN]->(p)
`

module.exports = {
  createRegions,
  createPrefectures,
  createCities,
};
