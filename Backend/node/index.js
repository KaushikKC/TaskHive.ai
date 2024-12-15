const express = require("express");
const bodyParser = require("body-parser");
const { fetchNFTs, executeNFTPurchase } = require("./services/nftservice");
const { fetchFlights, bookFlight } = require("./services/flightservice");
const { submitTask, getTaskStatus } = require("./services/taskservice");
const { getUserIdentity } = require("./services/userService");
const {
  updateSharedGraph,
  fetchSharedGraphData,
} = require("./services/sharedGraphService");
const { initiateCryptoPayment } = require("./services/paymentService");

const app = express();
app.use(bodyParser.json());

// NFT Operations
app.post("/fetch-nfts", async (req, res) => {
  const { collection, maxPrice } = req.body;
  const nfts = await fetchNFTs(collection, maxPrice);
  res.json(nfts);
});

app.post("/execute-nft-purchase", async (req, res) => {
  const { userId, nftId } = req.body;
  const result = await executeNFTPurchase(userId, nftId);
  res.json(result);
});

// Flight Operations
app.post("/fetch-flights", async (req, res) => {
  const { origin, destination, date, maxPrice } = req.body;
  const flights = await fetchFlights(origin, destination, date, maxPrice);
  res.json(flights);
});

app.post("/book-flight", async (req, res) => {
  const { userId, flightId } = req.body;
  const result = await bookFlight(userId, flightId);
  res.json(result);
});

// Task Management
app.post("/submit-task", async (req, res) => {
  const { userId, taskDetails } = req.body;
  const result = await submitTask(userId, taskDetails);
  res.json(result);
});

app.get("/task-status/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const status = await getTaskStatus(taskId);
  res.json(status);
});

// User Management
app.get("/user-identity/:userId", async (req, res) => {
  const { userId } = req.params;
  const identity = await getUserIdentity(userId);
  res.json(identity);
});

// Shared Graph
app.post("/update-shared-graph", async (req, res) => {
  const { entry } = req.body;
  const result = await updateSharedGraph(entry);
  res.json(result);
});

app.get("/shared-graph", async (req, res) => {
  const data = await fetchSharedGraphData();
  res.json(data);
});

// Payment Processing
app.post("/initiate-payment", async (req, res) => {
  const { walletAddress, amount, token } = req.body;
  const result = await initiateCryptoPayment(walletAddress, amount, token);
  res.json(result);
});

// Step 1 & 2: User Input Processing and AI Agent Parse Function
app.post("/process-user-input", async (req, res) => {
  try {
    const { userInput, userId } = req.body;

    // Get user identity and preferences
    const userIdentity = await getUserIdentity(userId);

    // Call AI Agent to parse input
    const parsedTask = await callAIAgentParse(userInput);

    // Store task
    const taskSubmission = await submitTask(userId, parsedTask);

    res.json({
      taskId: taskSubmission.taskId,
      parsedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 3 & 4: Fetch Recommendations with Personalization
app.post("/get-recommendations", async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await getTaskStatus(taskId);
    const userIdentity = await getUserIdentity(userId);

    // Call AI Agent for personalized recommendations
    const recommendations = await getPersonalizedRecommendations(
      task,
      userIdentity
    );

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 7 & 8: Execute Selected Task
app.post("/execute-task", async (req, res) => {
  try {
    const { taskId, userId, selectedOption } = req.body;
    const task = await getTaskStatus(taskId);

    // Call AI Agent to confirm task
    const confirmation = await confirmTaskWithAIAgent(task, selectedOption);

    // Execute the task based on type
    let result;
    switch (task.taskDetails.type) {
      case "NFT_PURCHASE":
        result = await executeNFTPurchase(userId, selectedOption.nftId);
        break;
      case "FLIGHT_BOOKING":
        result = await bookFlight(userId, selectedOption.flightId);
        break;
      case "CRYPTO_TRANSFER":
        result = await initiateCryptoPayment(
          selectedOption.recipientWallet,
          selectedOption.amount,
          selectedOption.token
        );
        break;
    }

    res.json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 9: Get Task Result
app.get("/task-result/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await getTaskStatus(taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Integration Helper Functions
async function callAIAgentParse(userInput) {
  const response = await fetch(`${process.env.AI_AGENT_URL}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: userInput }),
  });
  return response.json();
}

async function getPersonalizedRecommendations(task, userIdentity) {
  const response = await fetch(`${process.env.AI_AGENT_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, userIdentity }),
  });
  return response.json();
}

async function confirmTaskWithAIAgent(task, selectedOption) {
  const response = await fetch(`${process.env.AI_AGENT_URL}/confirm-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, selectedOption }),
  });
  return response.json();
}

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message: error.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
