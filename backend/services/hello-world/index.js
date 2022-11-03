import { api } from "@serverless/cloud";

api.get("/", async (req, res) => {
  res.send("Hello World!");
});
