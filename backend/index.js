require('dotenv').config()

const {
    createRegions,
    createPrefectures,
} = require('./cyphers/geography')

async function main () {
    const jpPrefecture = require("jp-prefecture");

    const regions = jpPrefecture.getAll("region");

    const prefectures = jpPrefecture.getAll("pref");

    const neo4j = require('neo4j-driver')
    const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4j_USERNAME, process.env.NEO4J_PASSWORD))

    const session = driver.session()

    try {
        await session.run(createRegions, { regions })

        await session.run(createPrefectures, { prefectures })
        console.log('Finished')
    } catch (err) {
        console.error(err)
    } finally {
        session.close()
        console.log('Session is closed')
        process.exit(0)
    }
}

main()