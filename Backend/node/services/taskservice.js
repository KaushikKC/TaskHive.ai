const tasks = new Map();

const submitTask = async (userId, taskDetails) => {
  try {
    // Get AI task analysis
    const aiAnalysis = await axios.post(
      `${process.env.AI_AGENT_URL}/analyze-task`,
      { userId, taskDetails }
    );

    const taskId = `task-${Date.now()}`;
    tasks.set(taskId, {
      userId,
      taskDetails,
      aiAnalysis: aiAnalysis.data,
      status: "pending",
      created: Date.now(),
    });

    return {
      status: "success",
      taskId,
      aiSuggestions: aiAnalysis.data.suggestions,
    };
  } catch (error) {
    console.error("Error submitting task:", error);
    throw new Error("Failed to submit task");
  }
};

const getTaskStatus = async (taskId) => {
  try {
    const task = tasks.get(taskId);
    if (!task) throw new Error("Task not found");

    // Get updated AI insights
    const aiInsights = await axios.post(
      `${process.env.AI_AGENT_URL}/task-insights`,
      { taskId, task }
    );

    return {
      taskId,
      ...task,
      aiInsights: aiInsights.data,
    };
  } catch (error) {
    console.error("Error fetching task status:", error);
    throw new Error("Failed to fetch task status");
  }
};

module.exports = { submitTask, getTaskStatus };
