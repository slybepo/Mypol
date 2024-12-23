const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const THREADS_DIR = "./threads";

// Ensure threads directory exists
if (!fs.existsSync(THREADS_DIR)) fs.mkdirSync(THREADS_DIR);

// Fetch all threads
app.get("/api/threads", (req, res) => {
  const files = fs.readdirSync(THREADS_DIR);
  const threads = files.map((file) => JSON.parse(fs.readFileSync(`${THREADS_DIR}/${file}`)));
  res.status(200).send(threads);
});

// Fetch a specific thread
app.get("/api/threads/:id", (req, res) => {
  const threadId = req.params.id;
  const filePath = `${THREADS_DIR}/${threadId}.json`;

  if (fs.existsSync(filePath)) {
    const thread = JSON.parse(fs.readFileSync(filePath));
    res.status(200).send(thread);
  } else {
    res.status(404).send({ error: "Thread not found" });
  }
});

// Create a new thread
app.post("/api/threads", (req, res) => {
  const { title, content, username } = req.body;
  const threadId = Date.now().toString();

  const threadData = {
    id: threadId,
    title,
    content,
    username,
    createdAt: new Date(),
  };

  fs.writeFileSync(`${THREADS_DIR}/${threadId}.json`, JSON.stringify(threadData));
  res.status(201).send({ success: true, threadId });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
         
