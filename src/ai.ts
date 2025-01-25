import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export const getAnswer = async (prompt: string): Promise<string> => {
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
    });

    if (msg.content[0].type !== "text") {
        console.error("Got unexpected response from API", msg);
        throw new Error("The first item in content was not type text");
    }

    const sql = msg.content[0].text;
    return sql;
}