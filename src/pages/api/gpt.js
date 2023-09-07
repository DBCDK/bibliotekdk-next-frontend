import OpenAI from "openai";
import getConfig from "next/config";
const config = getConfig();

const openai = new OpenAI({
  apiKey: config.serverRuntimeConfig.openAIKey,
});

const PROMPT_INTENT = `As a seasoned expert in deciphering user search queries on a website, your task is to discern and elucidate the core objective behind the user's search query, offering a comprehensive and succinct understanding.

Example Input:
nye artikler om harry potter

Example Output:
[
  "Content Type: Articles",
  "Publication Date: Recent",
  "Topic of Interest: Harry Potter"    
]

Keep it short, and do not write anything before or after example output.
`;

const PROMPT_EVAL_RESULT = `You specialize in evaluating how well item descriptions match a user's search intent for various media, such as books, movies, or other items typically found on a library website.

Example Input:
Content Type: Articles or Magazines
Publication Date: Recent
Topic of Interest: Harry Potter

Item Description:
Ud med Harry Potter af Poul Pilgaard Johnsen (artikel, 1990)

Example Output:
[
    {
        "aspect": "Content Type: Articles or Magazines",
        "score": 5,
        "reason": "Item is an article"
    },
    {
        "aspect": "Publication Date: Recent",
        "score": 1,
        "reason": "Item was released in 1990"
    },
    {
        "aspect": "Topic of Interest: Harry Potter",
        "score": 5,
        "reason": "The item relates to Harry Potter"
    }
]

Output MUST have exactly one object per input line, where aspect contains the line.
The score is rated on a scale from 1 to 5, with 5 indicating a strong alignment with the user's intent and 1 representing a poor match. 3 is a partial match.
Please refrain from adding any additional content before or after the example output.

`;

const PROMPT_EINSTEIN_COMMENT = `You are an incarnation of Albert Einstein, that create a humorous comment on the relevance of a search result for a user's query. The comment must target the performance of the search system. You must embed in your answer, that you take "5 dollars" for making this comment (in a funny way if possible).

Example Input:

User is looking for:
Content Type: Films
Topic of Interest: dirty harry

Search System Performance: POOR

Example Output:
In the search for a dirty Harry, one must embrace the essence of cleanliness! That'll be 5 dollars..
`;

async function fetchResponse({
  prompt,
  input,
  temperature = 0,
  max_tokens = 277,
}) {
  console.log(prompt, input);
  const request = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: input,
      },
    ],
    temperature,
    max_tokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  const response = await openai.chat.completions.create(request);
  try {
    return {
      request,
      response: JSON.parse(response.choices[0]?.message?.content),
      usage: response.usage,
    };
  } catch (e) {
    return {
      request,
      response: response.choices[0]?.message?.content,
      usage: response.usage,
    };
  }
}

export default async function handler(req, res) {
  let totalTokens = 0;
  const parsedBody = JSON.parse(req.body);

  const q = parsedBody.q;
  const intent = await fetchResponse({ prompt: PROMPT_INTENT, input: q });
  totalTokens += intent.usage.total_tokens;

  const rows = await Promise.all(
    parsedBody.result.map(async (str) => {
      const evaluation = await fetchResponse({
        prompt: PROMPT_EVAL_RESULT,
        input: `${intent.response.join("\n")}
          ${str}`,
      });
      totalTokens += evaluation.usage.total_tokens;
      return {
        item: str,
        evaluation,
      };
    })
  );

  let total = 0;
  let sum = 0;
  //   console.log(JSON.stringify(rows, null, 2));
  rows.forEach((row) =>
    row?.evaluation.response.forEach((aspect) => {
      total++;
      sum += aspect.score;
    })
  );
  const overallScore = sum / total;

  const performance =
    overallScore > 4
      ? "GREAT"
      : overallScore > 3
      ? "ACCEPTABLE"
      : overallScore > 1.5
      ? "NOT GOOD"
      : "TERRIBLE";

  const albertResponse = await fetchResponse({
    max_tokens: 100,
    prompt: PROMPT_EINSTEIN_COMMENT,
    input: `User is looking for:
${intent.response.join("\n")}

Search System Performance: ${performance}
`,
  });
  totalTokens += albertResponse.usage.total_tokens;

  //   console.log({ totalTokens });

  res.status(200).send({
    q,
    intent,
    result: rows,
    overallScore,
    performance,
    albertResponse,
    totalTokens,
  });
}

// queries
// harry potter føniksordnene film
