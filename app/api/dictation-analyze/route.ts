import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 设置 API 密钥和 Base URL
const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const baseUrl = 'https://api.deepseek.com/beta';

// 创建 OpenAI 客户端实例
const openai = new OpenAI({
    apiKey,
    baseURL: baseUrl,
});

// 读取模型名称
const modelName = 'deepseek-chat';

export async function GET(req: NextRequest) {
    const text1 = 'The quick brown fox jumps over the lazy dog. Every morning, the sun rises in the east and sets in the west. She sells seashells by the seashore. This sentence is a common example used to demonstrate typing skills. Practicing typing can help you become more efficient and accurate.';
    const text2 = 'The quick brown fox jump over the lazy dog. Every morning, the sun rise in the east and set in the west. She sells seashels by the seashore. This sentance is a common example used to demostrating typing skills. Practicing typing can helps you become more effecient and accurate.';

    try {
        // 发送请求给 OpenAI，获取完整的响应
        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: 'system',
                    content: 'You are a master of language education proficient in various languages.',
                },
                {
                    role: 'user',
                    content: `这是我的听写稿：${text2}。这是原文${text1}，请用德语帮我分析一下我听写的错误，以 markdown 方式返回结果。`,
                },
            ],
            max_tokens: 2000,
            temperature: 0.7,
            stream: false, // 禁用流式处理
        });

        // 提取响应内容
        const analysis = response.choices?.[0]?.message?.content;

        if (!analysis) {
            throw new Error('No content in OpenAI response');
        }

        // 返回响应内容
        return new Response(JSON.stringify({ analysis }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return new Response(JSON.stringify({ error: 'Failed to analyze the content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}