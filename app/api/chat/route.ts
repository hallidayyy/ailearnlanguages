import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { v4 as uuidv4 } from 'uuid';

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

// 读取模型名称的环境变量
const modelName = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'deepseek-chat';

export async function POST(req: NextRequest) {
  const { card_id, originalText, userId } = await req.json();

  try {
    // 调用deepseek-chat模型生成五个JSON结果
    const translationResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Translate the following text to Chinese:\n\n${originalText}\n\nOutput format: {"translation": ""}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });
    const translation = JSON.parse(translationResponse.choices[0].message.content.trim());

    const keywordsResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Extract keywords and their Chinese translations from the following text:\n\n${originalText}\n\nOutput format: {"keywords": [{"word": "", "translation": ""}]}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });
    const keywords = JSON.parse(keywordsResponse.choices[0].message.content.trim());

    const keygrammerResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Extract key grammar points and their explanations from the following text:\n\n${originalText}\n\nOutput format: {"keygrammer": [{"grammer": "", "description": "", "example": ""}]}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });
    const keygrammer = JSON.parse(keygrammerResponse.choices[0].message.content.trim());

    const rewritedarticleResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Rewrite the following text:\n\n${originalText}\n\nOutput format: {"content": ""}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });
    const rewritedarticle = JSON.parse(rewritedarticleResponse.choices[0].message.content.trim());

    const questionsResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Create 5 questions based on the following text:\n\n${originalText}\n\nOutput format: {"questions": [{"stem": "", "options": ["A": "", "B": "", "C": "", "D": ""], "answer": ""}]}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });
    const questions = JSON.parse(questionsResponse.choices[0].message.content.trim());

    // 将结果更新到Supabase数据库的cards表格中
    const supabase = await getDb();
    const { data: updatedData, error: updateError } = await supabase
      .from('cards')
      .update({
        translation: JSON.stringify(translation),
        keywords: JSON.stringify(keywords),
        keygrammer: JSON.stringify(keygrammer),
        rewritedarticle: JSON.stringify(rewritedarticle),
        questions: JSON.stringify(questions),
      })
      .eq('id', card_id)
      .select('*');

    if (updateError) {
      console.error('Error updating card:', updateError);
      return NextResponse.json({ message: 'Error updating card' }, { status: 500 });
    }

    // 检查所有字段是否都不为空
    const updatedCard = updatedData[0];
    if (
      updatedCard.translation &&
      updatedCard.keywords &&
      updatedCard.keygrammer &&
      updatedCard.rewritedarticle &&
      updatedCard.questions
    ) {
      // 更新tasks表格中的status为done
      const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({ status: 'done' })
        .eq('id', card_id);

      if (taskUpdateError) {
        console.error('Error updating task status:', taskUpdateError);
        return NextResponse.json({ message: 'Error updating task status' }, { status: 500 });
      }
    }

    // 返回成功响应
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error(error);
    // 返回错误响应
    return NextResponse.json({ message: 'Error generating response from API' }, { status: 500 });
  }
}