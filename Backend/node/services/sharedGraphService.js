const sharedGraph = [];

const updateSharedGraph = async (entry) => {
  try {
    sharedGraph.push(entry);
    return { status: "success", entry };
  } catch (error) {
    console.error("Error updating shared graph:", error);
    throw new Error("Failed to update shared graph");
  }
};

const fetchSharedGraphData = async () => {
  try {
    return sharedGraph;
  } catch (error) {
    console.error("Error fetching shared graph data:", error);
    throw new Error("Failed to fetch shared graph data");
  }
};

module.exports = { updateSharedGraph, fetchSharedGraphData };
