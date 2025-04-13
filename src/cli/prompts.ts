import prompts from "prompts";

export const promptPoll = async (polls: string[]) => {
  const { pollId }: { pollId: number } = await prompts({
    type: "select",
    name: "pollId",
    message: "Please select a poll",
    choices: polls.map((poll, i) => ({
      title: poll,
      value: i,
    })),
  });

  return { pollId };
};
