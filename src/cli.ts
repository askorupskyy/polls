import type { PollingApp } from "../dist/types/PollingApp.js";

import prompts from "prompts";
import assert from "node:assert";
import dotenv from "dotenv";

import { ethers } from "ethers";

import contractJSON from "../dist/artifacts/src/contracts/PollingApp.sol/PollingApp.json";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

assert(CONTRACT_ADDRESS, "CONTRACT_ADDRESS must be present in .env");
assert(PRIVATE_KEY, "PRIVATE_KEY must be present in .env");
assert(RPC_URL, "RPC_URL must be present in .env");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const app = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractJSON.abi,
  signer
) as unknown as PollingApp;

type Action = "create" | "vote";

const main = async () => {
  const { action }: { action: Action } = await prompts({
    name: "action",
    type: "select",
    message: "What would you like to do?",
    choices: [
      {
        title: "Create a poll",
        value: "create" as Action,
      },
      {
        title: "Vote in a poll",
        value: "vote" as Action,
      },
    ],
  });

  if (action === "create") {
    const { title, optionsRaw }: { title: string; optionsRaw: string } =
      await prompts([
        {
          type: "text",
          name: "title",
          message: "Poll title:",
        },
        {
          type: "text",
          name: "optionsRaw",
          message: "Poll options (comma-separated):",
        },
      ]);

    const options = optionsRaw.split(",").map((o) => o.trim());
    const tx = await app.createPoll(title, options);
    await tx.wait();

    console.log("Poll created!");
  }

  if (action === "vote") {
    const { pollId }: { pollId: number } = await prompts({
      type: "number",
      name: "pollId",
      message: "Please provide a poll ID",
    });

    const pollOptions = await app.getOptions(pollId);

    const { optionId }: { optionId: number } = await prompts({
      type: "select",
      name: "optionId",
      message: "Select an option you'd like to vote for",
      choices: pollOptions.map((option, i) => ({
        title: option,
        value: i,
      })),
    });

    await app.vote(pollId, optionId);

    console.log(`You voted for ${pollOptions[optionId]}!`);
  }

  // TODO: see results
};

main();
