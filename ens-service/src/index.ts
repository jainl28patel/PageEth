import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
const cors = require('cors');
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'


const app: Application = express();
app.use(cors());
const port = process.env.PORT || 3005;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
})

app.post("/resolve", async (req: Request, res: Response) => {
  try {
    const ensname = req.body.ensname
    const ethAddress = await client.getAddressRecord({ name: ensname });
    console.log(ethAddress);
    res.status(200).json(ethAddress);
  } catch (error) {
    res.status(500).json({ error });
  }
})

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
