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
  const { card_id, curr_lang } = await req.json();

  console.log(`Processing card_id: ${card_id}`);
  console.log(`Processing curr_lang: ${curr_lang}`);
  try {
    // 从 Supabase 数据库中获取 originalText
    const supabase = await getDb();
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .select('original')
      .eq('id', card_id)
      .single();

    if (cardError) {
      console.error('Error fetching card data:', cardError);
      return NextResponse.json({ message: 'Error fetching card data' }, { status: 500 });
    }

    const originalText = cardData.original;
    console.log(`Original text: ${originalText}`);

    // 调用deepseek-chat模型生成五个JSON结果
    console.log(`Calling OpenAI API with model: ${modelName}`);

    const translationResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a master of language education proficient in various languages.' },
        { role: 'user', content: `Translate the following text to ${curr_lang} and return the result in JSON format:\n\n${originalText}\n\nOutput format: {"translation": ""}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    if (!translationResponse.choices || !translationResponse.choices[0] || !translationResponse.choices[0].message || !translationResponse.choices[0].message.content) {
      console.error('Invalid translation response:', translationResponse);
      return NextResponse.json({ message: 'Invalid translation response' }, { status: 500 });
    }

    const translation = JSON.parse(translationResponse.choices[0].message.content.trim());
    console.log('Translation response:', translation);

    const keywordsResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are an expert in language education, skilled in identifying and translating key vocabulary from various texts.' },
        { role: 'user', content: `Extract the key vocabulary from the following text that are crucial for understanding the main ideas and themes. Provide their translations in ${curr_lang}. Return the result in the JSON format specified below:\n\n${originalText}\n\nOutput format:\n{\n  "keywords": [\n    {\n      "word": "example",\n      "translation": "translation example"\n    }\n  ]\n}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    if (!keywordsResponse.choices || !keywordsResponse.choices[0] || !keywordsResponse.choices[0].message || !keywordsResponse.choices[0].message.content) {
      console.error('Invalid keywords response:', keywordsResponse);
      return NextResponse.json({ message: 'Invalid keywords response' }, { status: 500 });
    }

    const keywords = JSON.parse(keywordsResponse.choices[0].message.content.trim());
    console.log('Keywords response:', keywords);

    const keygrammerResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a master of language education proficient in various languages.' },
        { role: 'user', content: `Extract key grammar points and their explanations from the following text and return the result in JSON format. Please provide the grammar descriptions in ${curr_lang} and the examples in the original text language.\n\n${originalText}\n\nOutput format: {"keygrammer": [{"grammer": "", "description": "", "example": ""}]}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    if (!keygrammerResponse.choices || !keygrammerResponse.choices[0] || !keygrammerResponse.choices[0].message || !keygrammerResponse.choices[0].message.content) {
      console.error('Invalid keygrammer response:', keygrammerResponse);
      return NextResponse.json({ message: 'Invalid keygrammer response' }, { status: 500 });
    }

    const keygrammer = JSON.parse(keygrammerResponse.choices[0].message.content.trim());
    console.log('Keygrammer response:', keygrammer);

    const rewritedarticleResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a master of language education proficient in various languages.' },
        { role: 'user', content: `Rewrite the following text in its original language with emphasis and return the result in JSON format:\n\n${originalText}\n\nOutput format: {"content": ""}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    if (!rewritedarticleResponse.choices || !rewritedarticleResponse.choices[0] || !rewritedarticleResponse.choices[0].message || !rewritedarticleResponse.choices[0].message.content) {
      console.error('Invalid rewrited article response:', rewritedarticleResponse);
      return NextResponse.json({ message: 'Invalid rewrited article response' }, { status: 500 });
    }

    const rewritedarticle = JSON.parse(rewritedarticleResponse.choices[0].message.content.trim());
    console.log('Rewrited article response:', rewritedarticle);

    const questionsResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a master of language education proficient in various languages.' },
        { role: 'user', content: `Create 5 questions based on the following text. The questions and answers should be in the same language as the original text. Return the result in JSON format:\n\n${originalText}\n\nOutput format: {\n  "questions": [\n    {\n      "stem": "",\n      "options": {\n        "A": "",\n        "B": "",\n        "C": "",\n        "D": ""\n      },\n      "answer": ""\n    }\n  ]\n}` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }, // 确保返回 JSON 格式
    });

    if (!questionsResponse.choices || !questionsResponse.choices[0] || !questionsResponse.choices[0].message || !questionsResponse.choices[0].message.content) {
      console.error('Invalid questions response:', questionsResponse);
      return NextResponse.json({ message: 'Invalid questions response' }, { status: 500 });
    }

    const questions = JSON.parse(questionsResponse.choices[0].message.content.trim());
    console.log('Questions response:', questions);

    // 将结果更新到Supabase数据库的cards表格中
    console.log('Updating Supabase database...');

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

    console.log('Card updated successfully:', updatedData);

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
      console.log('Updating task status to done...');

      const { error: taskUpdateError } = await supabase
        .from('task')
        .update({ status: 'done' })
        .eq('card_id', card_id);

      if (taskUpdateError) {
        console.error('Error updating task status:', taskUpdateError);
        return NextResponse.json({ message: 'Error updating task status' }, { status: 500 });
      }

      console.log('Task status updated to done successfully');
    }

    // 返回成功响应
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error generating response from API:', error);
    // 返回错误响应
    return NextResponse.json({ message: 'Error generating response from API' }, { status: 500 });
  }
}