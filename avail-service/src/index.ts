import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import avail from "./routes/avail";
const cors = require('cors');

const app: Application = express();
app.use(cors());
const port = process.env.PORT || 3004;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use("/avail", avail);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
