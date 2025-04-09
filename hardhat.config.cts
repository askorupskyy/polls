import type { HardhatUserConfig } from "hardhat/types/index.js";

import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

import dotenv from "dotenv";
import assert from "node:assert";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

assert(PRIVATE_KEY, "private key must exist in .env");

export default {
  solidity: "0.8.28",
  typechain: {
    outDir: "./dist/types",
    target: "ethers-v6",
  },
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./dist/artifacts",
    cache: "./dist/cache",
  },
} satisfies HardhatUserConfig;
