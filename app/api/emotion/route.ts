/* eslint-disable @typescript-eslint/no-unused-vars */
import { HfInference, TextClassificationOutput } from "@huggingface/inference";

let hf: HfInference;
export async function POST(req: Request, res: Response) {
  const { input } = await req.json();
  const infrenceResponse: TextClassificationOutput = await runInfrence(input);
  const filteredResponse = filterResponses([...infrenceResponse]);

  return new Response(
    JSON.stringify({
      infrenceResponse,
      filteredResponse,
    }),
    { status: 200 }
  );
}

function filterResponses(emotions: TextClassificationOutput) {
  const filtered = [];
  const emotion0 = emotions.shift();
  filtered.push(emotion0);
  let score = emotion0?.score;
  while (emotions.length > 0) {
    const emotionI = emotions.shift();
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (emotionI?.score! > score! * 0.5) {
      filtered.push(emotionI);
      score = emotionI?.score;
    } else {
      break;
    }
  }
  return filtered;
}

async function runInfrence(input: string) {
  if (!hf) {
    hf = new HfInference(process.env.HF_TOKEN);
  }
  const modelName = "SamLowe/roberta-base-go_emotions";
  const infrenceRes = await hf.textClassification({
    model: modelName,
    inputs: input,
  });
  return infrenceRes;
}
