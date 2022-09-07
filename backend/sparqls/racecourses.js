const formatLocation = `
# - City
OPTIONAL {
    ?location wdt:P31/wdt:P279 wd:Q515.
    BIND(wd:Q515 AS ?city)
}
# - Prefecture
OPTIONAL {
    ?location wdt:P31 wd:Q50337.
    BIND(wd:Q50337 AS ?prefecture)
}
# - Ward of Japan
OPTIONAL {
    ?location wdt:P31 wd:Q137773.
    BIND(wd:Q137773 AS ?ward)
}
# - Special Ward of Japan
OPTIONAL {
    ?location wdt:P31 wd:Q5327704.
    BIND(wd:Q5327704 AS ?specialWard)
}
# - Town of Japan
OPTIONAL {
    ?location wdt:P31 wd:Q1059478.
    BIND(wd:Q1059478 AS ?town)
}

# - Village of Japan
OPTIONAL {
    ?location wdt:P31 wd:Q4174776.
    BIND(wd:Q4174776 AS ?village)
}

# - Chocho
OPTIONAL {
    ?location wdt:P31 wd:Q5327369.
    BIND(wd:Q5327369 AS ?chocho)
}

# - Province
OPTIONAL {
    ?location wdt:P31 wd:Q860290.
    BIND(wd:Q860290 AS ?Province)
}

# - Neighborhood
OPTIONAL {
    ?location wdt:P31 wd:Q47446955.
    BIND(wd:Q47446955 AS ?Neighborhood)
}

# - Shinto Shrine
OPTIONAL {
    ?location wdt:P31|wdt:P31/wdt:P279 wd:Q845945.
    BIND(wd:Q865839 AS ?ShintoShrine)
}

OPTIONAL {
    ?location wdt:P31 wd:Q22746.
    BIND(wd:Q22746 AS ?Park)
}

OPTIONAL{
    ?location wdt:P31 wd:Q18663566.
    BIND(wd:Q18663566 AS ?DissolvedMunicipal)
}
BIND(
    IF(BOUND(?city), 'City',
    IF(BOUND(?prefecture), 'Prefecture',
    IF(BOUND(?ward), 'Ward',
    IF(BOUND(?specialWard), 'Special Ward',
    IF(BOUND(?town), 'Town',
    IF(BOUND(?village), 'Village',
    IF(BOUND(?chocho), 'Chocho',
    IF(BOUND(?Province), 'Province',
    IF(BOUND(?Neighborhood), 'Neighborhood',
    IF(BOUND(?ShintoShrine), 'Shinto Shrine',
    IF(BOUND(?Park), 'Park',
    IF(BOUND(?DissolvedMunicipal), 'Dissolved Municipal', '')
))))))))))) AS ?locationType)
`;

const listRaceCoursesInJapan = `
SELECT ?item ?itemLabel_ja ?itemLabel_en ?image ?location_ja ?locationType WHERE {
    ?item wdt:P31 wd:Q11822917;
          wdt:P17 wd:Q17;
    OPTIONAL {
      ?item wdt:P18 ?image;
    }

    OPTIONAL {
      ?item wdt:P131 ?location.

      ${formatLocation}
    }
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "ja".
      ?item rdfs:label ?itemLabel_ja.
      ?location rdfs:label ?location_ja;
    }
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "en".
      ?item rdfs:label ?itemLabel_en.
    }
  }
`;

module.exports = {
  listRaceCoursesInJapan,
};
