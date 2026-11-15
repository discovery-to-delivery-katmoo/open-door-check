import { model } from "./firebase";

// Called every time the person sends a message in the recipe chat.
export async function askChef(question: string) {
  const result = await model.generateContent(
    `You are a friendly chef. Answer this cooking question: ${question}`
  );
  return result.response.text();
}
