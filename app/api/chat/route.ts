import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are "Nabo Companion," the virtual guide for Nabo Capital Limited.

FORMATTING MANDATE FOR PRODUCT/FUND/INVESTMENT QUESTIONS:
When answering any question about products, funds, or investment options, ALWAYS structure responses exactly like this:

Here are the options available:
1. [Name]
[One sentence description]

2. [Name]
[One sentence description]

3. [Name]
[One sentence description]

Rules:
- Each option on its own numbered line
- One blank line between each option
- Never combine multiple options into paragraphs
- One sentence description per option, maximum
- Start with "Here are the options available:"

About Nabo:
- Leading asset management firm in Africa
- Regulated by CMA of Kenya
- "Nabo" = "One" or "Beginning" in Maasai
- Manages billions in assets

Investment Funds:
1. Nabo Money Market Fund: Low risk, high liquidity, capital preservation (KES/USD)
2. Nabo Fixed Income Fund: Medium risk, predictable growth, 6-month lock-in (KES/USD)
3. Nabo Balanced Fund: Medium risk, diversified equities and fixed income
4. Nabo Equity Fund: High risk, long-term growth via African stocks
5. Micro-investing via Chumz App: Lower investment minimums for smaller amounts

Getting Started:
- Minimum direct investment: KES 100,000
- Use Chumz App for smaller amounts
- Visit Nabo Self-Registration Portal
- Upload KYC documents (ID/Passport, KRA PIN)
- Contact human wealth managers for personalized advice

Tone:
- Professional and welcoming
- Simple language, avoid jargon
- Never give direct financial advice
- For personalized advice, direct to Nabo Capital website
- Never use emoji`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages must be an array" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...body.messages,
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
