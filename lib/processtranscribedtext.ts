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

    // 检查 translationResponse 是否有结果
    if (translationResponse.choices && translationResponse.choices[0] && translationResponse.choices[0].message && translationResponse.choices[0].message.content) {
      const translationContent = translationResponse.choices[0].message.content.trim();
      if (translationContent) {
        const translation = JSON.parse(translationContent);

        // 继续进行其他请求
        const keywordsResponse = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: `Extract keywords and their Chinese translations from the following text:\n\n${originalText}\n\nOutput format: {"keywords": [{"word": "", "translation": ""}]}` }
          ],
          model: 'deepseek-chat',
        });

        if (keywordsResponse.choices && keywordsResponse.choices[0] && keywordsResponse.choices[0].message && keywordsResponse.choices[0].message.content) {
          const keywordsContent = keywordsResponse.choices[0].message.content.trim();
          if (keywordsContent) {
            const keywords = JSON.parse(keywordsContent);

            const keygrammerResponse = await openai.chat.completions.create({
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: `Extract key grammar points and their explanations from the following text:\n\n${originalText}\n\nOutput format: {"keygrammer": [{"grammer": "", "description": "", "example": ""}]}` }
              ],
              model: 'deepseek-chat',
            });

            if (keygrammerResponse.choices && keygrammerResponse.choices[0] && keygrammerResponse.choices[0].message && keygrammerResponse.choices[0].message.content) {
              const keygrammerContent = keygrammerResponse.choices[0].message.content.trim();
              if (keygrammerContent) {
                const keygrammer = JSON.parse(keygrammerContent);

                const rewritedarticleResponse = await openai.chat.completions.create({
                  messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `Rewrite the following text:\n\n${originalText}\n\nOutput format: {"content": ""}` }
                  ],
                  model: 'deepseek-chat',
                });

                if (rewritedarticleResponse.choices && rewritedarticleResponse.choices[0] && rewritedarticleResponse.choices[0].message && rewritedarticleResponse.choices[0].message.content) {
                  const rewritedarticleContent = rewritedarticleResponse.choices[0].message.content.trim();
                  if (rewritedarticleContent) {
                    const rewritedarticle = JSON.parse(rewritedarticleContent);

                    const questionsResponse = await openai.chat.completions.create({
                      messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: `Create 5 questions based on the following text:\n\n${originalText}\n\nOutput format: {"questions": [{"stem": "", "options": ["A": "", "B": "", "C": "", "D": ""], "answer": ""}]}` }
                      ],
                      model: 'deepseek-chat',
                    });

                    if (questionsResponse.choices && questionsResponse.choices[0] && questionsResponse.choices[0].message && questionsResponse.choices[0].message.content) {
                      const questionsContent = questionsResponse.choices[0].message.content.trim();
                      if (questionsContent) {
                        const questions = JSON.parse(questionsContent);

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
                      } else {
                        console.error('Questions content is empty or invalid.');
                      }
                    } else {
                      console.error('Questions response did not contain a valid message.');
                    }
                  } else {
                    console.error('Rewrited article content is empty or invalid.');
                  }
                } else {
                  console.error('Rewrited article response did not contain a valid message.');
                }
              } else {
                console.error('Keygrammer content is empty or invalid.');
              }
            } else {
              console.error('Keygrammer response did not contain a valid message.');
            }
          } else {
            console.error('Keywords content is empty or invalid.');
          }
        } else {
          console.error('Keywords response did not contain a valid message.');
        }
      } else {
        console.error('Translation content is empty or invalid.');
      }
    } else {
      console.error('Translation response did not contain a valid message.');
    }
  } catch (error) {
    console.error('Error processing transcribed text:', error);
  }
};

export default processtranscribedtext;