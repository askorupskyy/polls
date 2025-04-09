import { ethers } from "ethers";
import contractJSON from "../../dist/artifacts/src/contracts/PollingApp.sol/PollingApp.json";
import type { PollingApp } from "../../dist/types/PollingApp.js";
import { CONTRACT_ADDRESS, PRIVATE_KEY, RPC_URL } from "./env";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export const app = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractJSON.abi,
  signer
) as unknown as PollingApp;
