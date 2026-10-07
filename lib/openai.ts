const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResult {
  text: string | null;
  productId: string | null;
}

const PRODUCT_IDS = [
  "matrix",
  "karmic-knots",
  "spiritual-sphere",
  "relationships",
  "compatibility",
  "code-money",
  "code-luck",
  "code-relationships",
  "code-health",
  "code-spiritual",
  "forecast",
  "qa5",
  "consult",
] as const;

const PRESENT_PRODUCT_TOOL = {
  type: "function",
  function: {
    name: "present_product",
    description:
      "Call this once the person is ready to see payment details for a specific product — e.g. they named it or agreed to your suggestion. Do not write the price or payment link yourself, the system adds it automatically.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string", enum: PRODUCT_IDS },
      },
      required: ["productId"],
    },
  },
};

export async function getChatReply(messages: ChatMessage[]): Promise<ChatResult> {
  if (!OPENAI_API_KEY) return { text: null, productId: null };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        tools: [PRESENT_PRODUCT_TOOL],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!res.ok) return { text: null, productId: null };

    const data = await res.json();
    const message = data.choices?.[0]?.message;
    const toolCall = message?.tool_calls?.[0];

    let productId: string | null = null;
    if (toolCall?.function?.name === "present_product") {
      try {
        productId = JSON.parse(toolCall.function.arguments)?.productId ?? null;
      } catch {
        productId = null;
      }
    }

    return { text: message?.content ?? null, productId };
  } catch {
    return { text: null, productId: null };
  }
}
