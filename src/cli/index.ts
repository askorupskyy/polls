import prompts from "prompts";

import { app } from "./contract";

type Action = "create" | "vote" | "results";

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
      {
        title: "See results of a poll",
        value: "results" as Action,
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

  if (action === "results") {
    const { pollId }: { pollId: number } = await prompts({
      type: "number",
      name: "pollId",
      message: "Please provide a poll ID",
    });

    const [pollOptions, pollResults] = await Promise.all([
      app.getOptions(pollId),
      app.getResults(pollId),
    ]);

    console.log(`............Poll results............`);
    for (const i in pollOptions) {
      console.log(`${pollOptions[i]} >> \t${pollResults[i]} votes`);
    }
    console.log(`.....................................`);
  }
};

main().catch((err: { code?: string; reason?: string }) => {
  if ("code" in err) {
    console.log("Execution failed >>", err.reason);
    return;
  }

  throw err;
});
