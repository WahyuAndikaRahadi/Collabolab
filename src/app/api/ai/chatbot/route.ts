import { NextRequest, NextResponse } from "next/server";
import { callChatbotAI } from "@/lib/ai/chatbot";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Pesan terlalu panjang (maks 500 karakter)." }, { status: 400 });
    }

    const response = await callChatbotAI(message, history || []);
    return NextResponse.json({ response });
  } catch (err: any) {
    console.error("[CHATBOT_ROUTE_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Gagal mendapatkan respon dari AI." },
      { status: 500 }
    );
  }
}
