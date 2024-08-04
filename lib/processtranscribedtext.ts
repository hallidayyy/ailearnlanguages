import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径

const openai = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_DEEPSEEK_API_KEY'],
});

const processtranscribedtext = async (card_id: number, originalText: string, userId: number): Promise<void> => {
  try {
    // 调用deepseek-chat模型生成五个JSON结果
    const translationResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Translate the following text to Chinese:\n\n${originalText}\n\nOutput format: {"translation": ""}` }
      ],
      model: 'deepseek-chat',
    });
    const translation = JSON.parse(translationResponse.choices[0].message.content.trim());

    const keywordsResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Extract keywords and their Chinese translations from the following text:\n\n${originalText}\n\nOutput format: {"keywords": [{"word": "", "translation": ""}]}` }
      ],
      model: 'deepseek-chat',
    });
    const keywords = JSON.parse(keywordsResponse.choices[0].message.content.trim());

    const keygrammerResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Extract key grammar points and their explanations from the following text:\n\n${originalText}\n\nOutput format: {"keygrammer": [{"grammer": "", "description": "", "example": ""}]}` }
      ],
      model: 'deepseek-chat',
    });
    const keygrammer = JSON.parse(keygrammerResponse.choices[0].message.content.trim());

    const rewritedarticleResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Rewrite the following text:\n\n${originalText}\n\nOutput format: {"content": ""}` }
      ],
      model: 'deepseek-chat',
    });
    const rewritedarticle = JSON.parse(rewritedarticleResponse.choices[0].message.content.trim());

    const questionsResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Create 5 questions based on the following text:\n\n${originalText}\n\nOutput format: {"questions": [{"stem": "", "options": ["A": "", "B": "", "C": "", "D": ""], "answer": ""}]}` }
      ],
      model: 'deepseek-chat',
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
      return;
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
      } else {
        console.log('Task status updated to done successfully');
      }
    }
  } catch (error) {
    console.error('Error processing transcribed text:', error);
  }
};

export default processtranscribedtext;