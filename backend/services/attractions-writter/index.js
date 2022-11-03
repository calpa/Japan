import { api, schedule, params } from "@serverless/cloud";

import { Client, LogLevel } from "@notionhq/client";

import amqplib from "amqplib";

// Initializing a client
const notion = new Client({
  auth: params.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
});

const getAttractions = async () => {
  const databaseId = params.ATTRACTIONS_DATABASE_ID;
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        timestamp: "last_edited_time",
        direction: "descending",
      },
    ],

    // filter: {
    //   property: "Tags",
    //   multi_select: {
    //     contains: "東京"
    //   }
    // }
  });

  const { results } = response;

  console.log(`There are ${results.length} results`);
  return results;
};

const sendMessage = async () => {
  const queue = "attractions-writter-queue";
  const connection = await amqplib.connect(params.AMQP_URL);

  const channel = await connection.createChannel();
  await channel.assertQueue(queue);

  const message = JSON.stringify({
    updated: new Date(),
  });

  await channel.sendToQueue(queue, Buffer.from(message));
  console.log("Successfully sent message to queue");
};

schedule.every("1 hour", async () => {
  console.log("Start");
  await getAttractions();

  // TODO: Write to Neo4j Database
  await sendMessage();
});

// api.get('/', async (req, res) => {
//   const results = await getAttractions()
//   await sendMessage()
//   res.send(results)
// })
