import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
export const POST = async (req: Request) => {
  const { question } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // const prompt = "Write a story about a magic backpack.";
  const prompt = question;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return NextResponse.json({ reply: text });
};
