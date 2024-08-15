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

export async function POST(req: NextRequest) {
    const { text1, text2, user_lang } = await req.json();

    function getLanguageName(langCode: string): string {
        const languageMap: { [key: string]: string } = {
            "zh": "Chinese",
            "ja": "Japanese",
            "fr": "French",
            "en": "English"
        };
    
        return languageMap[langCode] || "Unknown language";
    }



    if (!text1 || !text2 || !user_lang) {
        return new Response(JSON.stringify({ error: 'Missing text1 or text2' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const lang_name =getLanguageName(user_lang);
    
    try {
        // 发送请求给 OpenAI，获取非流式响应
        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: 'system',
                    content: `The user is practicing dictation, please provide the differences between the dictation script and the original text, the reasons for these differences, and a summary of the listening skills, and output them in JSON format.
                            EXAMPLE INPUT: Dictation: "hello this is my friend tom, i am andy", Original: "hi, that is my friend tommy, and i am and"
                            EXAMPLE JSON OUTPUT:
                                                {
                                                    "differences": {
                                                        "difference": [
                                                            {
                                                                "original": "this is my friend tom",
                                                                "wrong": "that is my friend tommy",
                                                                "reason": "Similar pronunciation, confused"
                                                            },
                                                            {
                                                                "original": "i am andy",
                                                                "wrong": "and i am and",
                                                                "reason": "Omitted part of the information"
                                                            }
                                                        ]
                                                    },
                                                    "summary": "Your listening skills are average; you need to improve in pronunciation recognition and information completeness"
                                                }`,
                },
                {
                    role: 'user',
                    content: `dictation is: ${text2}. original text is: ${text1}. analyze the errors and reasons in dictation using ${lang_name}.`,
                },
            ],
            max_tokens: 4000,
            temperature: 0.7,
            stream: false, // 禁用流式处理
            response_format: {
                type: 'json_object'
            }
        });

        // 返回非流式响应
        return new Response(JSON.stringify(response.choices[0].message.content), {
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