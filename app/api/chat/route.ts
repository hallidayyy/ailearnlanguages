// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 检查当前环境是否是生产环境
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

// 根据环境选择相应的 API 密钥
const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_OPENAI_API_KEY
  : process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// 如果是非生产环境，设置 Deepseek 的 base URL
const baseUrl = isProduction ? undefined : 'https://api.deepseek.com/beta';

// 创建 OpenAI 客户端实例
const openai = new OpenAI({
  apiKey,
  baseURL: baseUrl,
});

export async function POST(req: NextRequest) {
  const { prompt, maxTokens } = await req.json();

  try {
    // 创建 Chat Completion 请求
    const response = await openai.chat.completions.create({
      model: isProduction ? 'text-davinci-003' : 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that outputs JSON format.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens || 100,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    // 返回响应数据
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    // 返回错误响应
    return NextResponse.json({ message: 'Error generating response from API' }, { status: 500 });
  }
}