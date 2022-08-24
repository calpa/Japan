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
MERGE (c:Municipal:City{id: city.id})
SET c.en = city.en,
    c.name = city.name,
    c.population = apoc.number.parseInt(city.population),
    c.area = apoc.number.parseFloat(city.area),
    c.density = apoc.number.parseFloat(city.density),
    c.founded = city.founded
WITH c, city
MATCH (p:Prefecture)
WHERE p.en = toLower(city.prefecture)
  OR p.en = toLower(
    replace(
      replace(city.prefecture, 'ō', 'o'),
      'Ō',
      'O'
    )
  )
MERGE (c)-[:IN]->(p)
`;

const createAirports = cypher`
UNWIND $airports as airport
MERGE (a:Airport{name: airport.name})
SET a.ICAO = airport.ICAO,
    a.IATA = airport.IATA

WITH a, airport
MERGE (c1:Classification{name: airport.classification})
MERGE (a)-[:IS]->(c1)

WITH a, airport
UNWIND airport.municipality as municipal
UNWIND airport.prefecture as prefecture
MERGE (m:Municipal{en: municipal})
WITH a, airport, m, municipal, prefecture
MATCH (m)-[:IN]->(p:Prefecture)
WHERE p.en = toLower(prefecture)
  OR p.en = toLower(
    replace(
      replace(prefecture, 'ō', 'o'),
      'Ō',
      'O'
    )
  )
MERGE (m)-[:HAS]->(a)
`

module.exports = {
  createRegions,
  createPrefectures,
  createCities,
  createAirports,
};
