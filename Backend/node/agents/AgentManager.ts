// src/agent/AgentManager.ts
import { AIAgent } from "./AIAgent";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";

export class AgentManager {
  private agents: Map<string, AIAgent> = new Map();
  private connection: Connection;
  private program: Program;

  constructor(connection: Connection, program: Program) {
    this.connection = connection;
    this.program = program;
  }

  async createAgent(walletAddress: string, preferences: any) {
    const agent = new AIAgent(this.connection, this.program, {
      walletAddress,
      ...preferences,
    });
    this.agents.set(walletAddress, agent);
    agent.start();
  }

  stopAgent(walletAddress: string) {
    const agent = this.agents.get(walletAddress);
    if (agent) {
      // Implement stop logic
      this.agents.delete(walletAddress);
    }
  }

  getAgent(walletAddress: string) {
    return this.agents.get(walletAddress);
  }
}
