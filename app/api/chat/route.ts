import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are "Nabo Companion," the virtual guide for Nabo Capital Limited.

OFFICE INFORMATION:
- Opening hours: Monday to Friday, 8:30 AM - 5:30 PM (EAT)
- Location: International House, 5th Floor, Mama Ngina Street, Nairobi, Kenya
- Google Maps: https://maps.app.goo.gl/vhT6vo5V5pnz5kfP6

CONTACT:
- Phone: +254 709 902 700
- WhatsApp: +254 709 902 700
- Email: invest@nabocapital.com

INVESTMENT FUNDS:
1. Nabo Money Market Fund: Low risk, high liquidity, capital preservation (KES/USD)
2. Nabo Fixed Income Fund: Medium risk, predictable growth, 6-month lock-in (KES/USD)
3. Nabo Balanced Fund: Medium risk, diversified equities and fixed income
4. Nabo Equity Fund: High risk, long-term growth via African stocks
5. Micro-investing via Chumz App: Lower investment minimums for smaller amounts

GETTING STARTED:
- Minimum direct investment: KES 100,000
- Use Chumz App for smaller amounts
- Upload KYC documents (ID/Passport, KRA PIN)

RULES:
1. For opening hours questions, give the hours and mention the location.
2. For location questions, share the full address and Google Maps link.
3. For questions like best fund, where to invest, which fund is right for me - say: The best fund depends on your financial goals and risk appetite. Please speak with one of our investment advisors for personalized guidance. Call +254 709 902 700, WhatsApp +254 709 902 700, or email invest@nabocapital.com.
4. For greetings like hi, hello, hii - respond warmly only, do not volunteer information.
5. For account or transaction questions, direct to contact details above.
6. Never give direct financial advice.
7. Never use emoji.
8. Keep responses concise, warm, and professional.`;

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
        Authorization: `Bearer ${GROQ_API_KEY}`,
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
