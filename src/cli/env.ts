import dotenv from "dotenv";
import assert from "node:assert";

dotenv.config();

assert(
  process.env.CONTRACT_ADDRESS,
  "CONTRACT_ADDRESS must be present in .env"
);
assert(process.env.PRIVATE_KEY, "PRIVATE_KEY must be present in .env");
assert(process.env.RPC_URL, "RPC_URL must be present in .env");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

export { CONTRACT_ADDRESS, PRIVATE_KEY, RPC_URL };
