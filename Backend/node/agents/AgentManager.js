// src/agent/AgentManager.ts
const { Connection, PublicKey } = require("@solana/web3.js");
const { Program } = require("@project-serum/anchor");
const { AIAgent } = require("./AIAgent");

class AgentManager {
  constructor(connection, program) {
    this.connection = connection;
    this.program = program;
  }

  async createAgent(walletAddress, preferences) {
    const agent = new AIAgent(this.connection, this.program, {
      walletAddress,
      ...preferences,
    });
    this.agents.set(walletAddress, agent);
    agent.start();
  }

  stopAgent(walletAddress) {
    const agent = this.agents.get(walletAddress);
    if (agent) {
      // Implement stop logic
      this.agents.delete(walletAddress);
    }
  }

  getAgent(walletAddress) {
    return this.agents.get(walletAddress);
  }
}

module.exports = { AgentManager };
